import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request, { params }) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { id } = await params

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('drafts')
      .select(`
        *,
        draft_voice_notes (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { id } = await params

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updateData = await request.json()

    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.created_at
    delete updateData.draft_voice_notes

    const { data, error } = await supabase
      .from('drafts')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        draft_voice_notes (*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { id } = await params

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First, get the draft to access voice notes
    const { data: draft } = await supabase
      .from('drafts')
      .select('draft_voice_notes (*)')
      .eq('id', id)
      .single()

    // Delete voice note files from storage
    if (draft && draft.draft_voice_notes) {
      for (const voiceNote of draft.draft_voice_notes) {
        const fileName = voiceNote.file_url.split('/').pop()
        await supabase.storage
          .from('voice-notes')
          .remove([`drafts/${id}/${fileName}`])
      }
    }

    // Delete the draft (cascade will handle draft_voice_notes table)
    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Draft deleted successfully' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}