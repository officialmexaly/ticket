import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a simple Supabase client without auth dependencies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Get single ticket - same query pattern as other operations
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select(`
        *,
        voice_notes (*),
        attachments (*)
      `)
      .eq('id', id)
      .single()

    if (ticketError) {
      return NextResponse.json({ error: ticketError.message }, { status: 400 })
    }

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params

    // Parse request data - same pattern as POST
    const updateData = await request.json()

    // Validate required fields - same pattern as POST
    if (!updateData.subject || !updateData.description) {
      return NextResponse.json(
        { error: 'Subject and description are required' },
        { status: 400 }
      )
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.created_at
    delete updateData.voice_notes

    // Update ticket using same query pattern
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        voice_notes (*),
        attachments (*)
      `)
      .single()

    if (ticketError) {
      return NextResponse.json({ error: ticketError.message }, { status: 400 })
    }

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // First, get the ticket to access voice notes and attachments - same pattern as other operations
    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('voice_notes (*), attachments (*)')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Delete voice note files from storage
    if (ticket.voice_notes && ticket.voice_notes.length > 0) {
      for (const voiceNote of ticket.voice_notes) {
        try {
          const fileName = voiceNote.file_url.split('/').pop()
          await supabase.storage
            .from('voice-notes')
            .remove([`${id}/${fileName}`])
        } catch (storageError) {
          console.error('Error deleting voice note file:', storageError)
          // Continue with ticket deletion even if file deletion fails
        }
      }
    }

    // Attachments are stored directly in database, no separate file cleanup needed
    // They will be deleted automatically via CASCADE when the ticket is deleted

    // Delete the ticket (cascade will handle voice_notes and attachments tables)
    const { error: deleteError } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}