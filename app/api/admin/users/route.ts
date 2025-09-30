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
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check admin permissions
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check admin permissions
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, updates } = await request.json()

    if (!userId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that we're only updating allowed fields
    const allowedFields = ['is_admin', 'is_super_admin', 'full_name', 'avatar_url']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: Record<string, unknown>, key) => {
        obj[key] = updates[key]
        return obj
      }, {})

    const { data, error } = await supabase
      .from('user_profiles')
      .update(filteredUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check admin permissions
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // For now, we'll just mark the user as inactive rather than actually deleting
    // Real user deletion would require admin SDK
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)

    if (error) throw error

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}