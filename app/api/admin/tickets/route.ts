import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Check if user has admin permissions
async function isAdmin(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return false

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin, is_super_admin')
    .eq('id', user.id)
    .single()

  return profile?.is_admin || profile?.is_super_admin || false
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check admin permissions
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const type = searchParams.get('type')
    const assignedTo = searchParams.get('assigned_to')

    let query = supabase
      .from('tickets')
      .select(`
        *,
        voice_notes (*)
      `)
      .order('created_at', { ascending: false })

    // Add filters if provided
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)
    if (type) query = query.eq('type', type)
    if (assignedTo) query = query.eq('assigned_to', assignedTo)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching admin tickets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check admin permissions
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { ticketId, updates } = await request.json()

    if (!ticketId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.voice_notes

    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketId)
      .select(`
        *,
        voice_notes (*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check admin permissions
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { ticketId } = await request.json()

    if (!ticketId) {
      return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 })
    }

    // First, get the ticket to access voice notes
    const { data: ticket } = await supabase
      .from('tickets')
      .select('voice_notes (*)')
      .eq('id', ticketId)
      .single()

    // Delete voice note files from storage
    if (ticket && ticket.voice_notes) {
      for (const voiceNote of ticket.voice_notes) {
        const fileName = voiceNote.file_url.split('/').pop()
        await supabase.storage
          .from('voice-notes')
          .remove([`${ticketId}/${fileName}`])
      }
    }

    // Delete the ticket (cascade will handle voice_notes table)
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', ticketId)

    if (error) throw error

    return NextResponse.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}