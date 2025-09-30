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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_identifier = searchParams.get('user_identifier')
    const unread_only = searchParams.get('unread_only') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Add filters if provided
    if (user_identifier) {
      query = query.eq('user_identifier', user_identifier)
    }

    if (unread_only) {
      query = query.eq('read', false)
    }

    const { data: notifications, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(notifications || [])
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const notificationData = {
      title: body.title,
      message: body.message,
      type: body.type || 'info',
      ticket_id: body.ticket_id || null,
      user_identifier: body.user_identifier || null,
      read: false,
      metadata: body.metadata || {}
    }

    // Validate required fields
    if (!notificationData.title || !notificationData.message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    // Insert notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send push notification if user has enabled it
    // This would typically integrate with a push service like FCM, OneSignal, etc.
    // For now, we'll just return the created notification

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { ids, action } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Notification IDs are required' },
        { status: 400 }
      )
    }

    let updateData = {}

    switch (action) {
      case 'mark_read':
        updateData = { read: true, read_at: new Date().toISOString() }
        break
      case 'mark_unread':
        updateData = { read: false, read_at: null }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "mark_read" or "mark_unread"' },
          { status: 400 }
        )
    }

    const { data: notifications, error } = await supabase
      .from('notifications')
      .update(updateData)
      .in('id', ids)
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',')
    const user_identifier = searchParams.get('user_identifier')
    const clear_all = searchParams.get('clear_all') === 'true'

    if (clear_all && user_identifier) {
      // Clear all notifications for a user
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_identifier', user_identifier)

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json({ message: 'All notifications cleared' })
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: 'Notification IDs are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Notifications deleted' })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}