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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const type = searchParams.get('type')
    const user_identifier = searchParams.get('user_identifier')

    // No authentication required - skip user session check

    let query = supabase
      .from('tickets')
      .select(`
        *,
        voice_notes (*),
        attachments (*)
      `)
      .order('created_at', { ascending: false })

    // Add filters if provided
    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (user_identifier) {
      query = query.eq('user_identifier', user_identifier)
    }

    const { data: tickets, error: ticketsError } = await query

    if (ticketsError) {
      return NextResponse.json({ error: ticketsError.message }, { status: 400 })
    }

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // No authentication required - skip user session check

    const contentType = request.headers.get('content-type')
    let ticketData
    const voiceNotes = []
    const attachments = []

    if (contentType?.includes('application/json')) {
      // Handle JSON requests
      const body = await request.json()
      ticketData = {
        subject: body.subject,
        description: body.description,
        priority: body.priority || 'Medium',
        type: body.type || 'Question',
        status: body.status || 'Open',
        user_identifier: body.userIdentifier || body.user_identifier
      }
    } else {
      // Handle FormData requests (with voice notes)
      const formData = await request.formData()

      ticketData = {
        subject: formData.get('subject'),
        description: formData.get('description'),
        priority: formData.get('priority') || 'Medium',
        type: formData.get('type') || 'Question',
        status: formData.get('status') || 'Open',
        user_identifier: formData.get('userIdentifier') || formData.get('user_identifier')
      }

      // Process voice notes and attachments
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('voice_note_') && value instanceof File) {
          // We'll process these after creating the ticket
          voiceNotes.push({ key, file: value })
        } else if (key.startsWith('attachment_') && value instanceof File) {
          // We'll process these after creating the ticket
          attachments.push({ key, file: value })
        }
      }
    }

    // Validate required fields
    if (!ticketData.subject || !ticketData.description) {
      return NextResponse.json(
        { error: 'Subject and description are required' },
        { status: 400 }
      )
    }

    // No user authentication - tickets are created anonymously

    // Insert ticket (RLS policies will handle permissions)
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select(`
        *,
        voice_notes (*),
        attachments (*)
      `)
      .single()

    if (ticketError) {
      return NextResponse.json({ error: ticketError.message }, { status: 400 })
    }

    // Immediately broadcast the new ticket to all connected clients
    try {
      // Send to dashboard channel
      await supabase
        .channel('dashboard-updates')
        .send({
          type: 'broadcast',
          event: 'ticket_created',
          payload: {
            ticket: ticket,
            timestamp: new Date().toISOString()
          }
        })

      console.log('✅ Broadcast sent to dashboard-updates channel')
    } catch (broadcastError) {
      console.error('❌ Failed to send broadcast:', broadcastError)
      // Don't fail the request if broadcast fails
    }

    // Create notification immediately
    try {
      await supabase
        .from('notifications')
        .insert({
          title: 'New Ticket Created',
          message: `"${ticket.subject}" - ${ticket.type} (${ticket.priority} priority)`,
          type: 'ticket_created',
          ticket_id: ticket.id,
          user_identifier: ticket.user_identifier,
          read: false
        })
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError)
      // Don't fail the ticket creation if notification fails
    }

    // Handle voice notes if present
    const processedVoiceNotes = []
    for (const voiceNote of voiceNotes) {
      try {
        // Upload to Supabase Storage
        const fileName = `${ticket.id}/${Date.now()}-${voiceNote.key}.wav`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice-notes')
          .upload(fileName, voiceNote.file, {
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
        const { data: savedVoiceNote, error: voiceError } = await supabase
          .from('voice_notes')
          .insert({
            ticket_id: ticket.id,
            file_url: publicUrl,
            duration: 60 // You might want to calculate actual duration
          })
          .select()
          .single()

        if (!voiceError) {
          processedVoiceNotes.push(savedVoiceNote)
        }
      } catch (error) {
        console.error('Error processing voice note:', error)
      }
    }

    // Handle attachments if present
    const processedAttachments = []
    for (const attachment of attachments) {
      try {
        // Read file as buffer
        const fileBuffer = await attachment.file.arrayBuffer()
        const fileData = Buffer.from(fileBuffer)

        // Save attachment record directly to database
        const { data: savedAttachment, error: attachmentError } = await supabase
          .from('attachments')
          .insert({
            ticket_id: ticket.id,
            original_name: attachment.file.name,
            file_size: attachment.file.size,
            mime_type: attachment.file.type,
            file_data: fileData,
            user_identifier: ticket.user_identifier
          })
          .select()
          .single()

        if (!attachmentError) {
          processedAttachments.push(savedAttachment)
        } else {
          console.error('Attachment save error:', attachmentError)
        }
      } catch (error) {
        console.error('Error processing attachment:', error)
      }
    }

    // Create a response with the ticket data
    const responseData = {
      ...ticket,
      voice_notes: processedVoiceNotes,
      attachments: processedAttachments
    }

    // Create the response with custom headers to trigger immediate updates
    const response = NextResponse.json(responseData)
    response.headers.set('X-Trigger-Update', 'ticket_created')
    // Note: Removed X-Ticket-Data header to avoid ByteString conversion errors with Unicode characters

    return response
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}