import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const user_identifier = searchParams.get('user_identifier')

    let query = supabase
      .from('drafts')
      .select(`
        *,
        draft_voice_notes (*)
      `)
      .order('updated_at', { ascending: false })

    // Filter by user if provided
    if (user_identifier) {
      query = query.eq('user_identifier', user_identifier)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current organization
    const { data: userOrganizations } = await supabase
      .from('organization_memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .limit(1)

    if (!userOrganizations || userOrganizations.length === 0) {
      return NextResponse.json({ error: 'User not assigned to any organization' }, { status: 403 })
    }

    const organizationId = userOrganizations[0].organization_id

    const formData = await request.formData()

    // Extract draft data
    const draftData = {
      organization_id: organizationId,
      title: formData.get('title'),
      subject: formData.get('subject'),
      description: formData.get('description'),
      priority: formData.get('priority') || 'Medium',
      type: formData.get('type') || 'Question',
      status: formData.get('status') || 'Open',
      user_identifier: formData.get('userIdentifier') || formData.get('user_identifier'),
      user_id: user.id
    }

    // Validate required fields
    if (!draftData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Insert draft
    const { data: draft, error: draftError } = await supabase
      .from('drafts')
      .insert(draftData)
      .select()
      .single()

    if (draftError) {
      return NextResponse.json({ error: draftError.message }, { status: 400 })
    }

    // Handle voice notes if present
    const voiceNotes = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('voice_note_') && value instanceof File) {
        try {
          // Upload to Supabase Storage
          const fileName = `drafts/${draft.id}/${Date.now()}-${key}.wav`
          const { error: uploadError } = await supabase.storage
            .from('voice-notes')
            .upload(fileName, value, {
              contentType: 'audio/wav'
            })

          if (uploadError) {
            console.error('Voice note upload error:', uploadError)
            continue
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('voice-notes')
            .getPublicUrl(fileName)

          // Save voice note record
          const { data: voiceNote, error: voiceError } = await supabase
            .from('draft_voice_notes')
            .insert({
              organization_id: organizationId,
              draft_id: draft.id,
              file_url: publicUrl,
              duration: 60 // You might want to calculate actual duration
            })
            .select()
            .single()

          if (!voiceError) {
            voiceNotes.push(voiceNote)
          }
        } catch (error) {
          console.error('Error processing voice note:', error)
        }
      }
    }

    return NextResponse.json({ ...draft, draft_voice_notes: voiceNotes })
  } catch (error) {
    console.error('Error creating draft:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}