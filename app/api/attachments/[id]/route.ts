import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a simple Supabase client without auth dependencies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get attachment data from database
    const { data: attachment, error: attachmentError } = await supabase
      .from('attachments')
      .select('original_name, mime_type, file_data, file_size')
      .eq('id', id)
      .single()

    if (attachmentError) {
      return NextResponse.json({ error: attachmentError.message }, { status: 400 })
    }

    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 })
    }

    // Return file data as response
    const response = new NextResponse(attachment.file_data, {
      status: 200,
      headers: {
        'Content-Type': attachment.mime_type || 'application/octet-stream',
        'Content-Length': attachment.file_size.toString(),
        'Content-Disposition': `attachment; filename="${attachment.original_name}"`,
      },
    })

    return response
  } catch (error) {
    console.error('Error serving attachment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}