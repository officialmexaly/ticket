import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const task_id = searchParams.get('task_id')
    const status = searchParams.get('status')
    const assigned_to = searchParams.get('assigned_to')

    let query = supabase
      .from('sub_tasks')
      .select(`
        *,
        tasks (
          title,
          features (
            name,
            epics (name, color)
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (task_id) {
      query = query.eq('task_id', task_id)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to)
    }

    const { data: subtasks, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(subtasks)
  } catch (error) {
    console.error('Error fetching sub-tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const subtaskData = {
      task_id: body.task_id,
      title: body.title,
      description: body.description,
      atomic_work_description: body.atomic_work_description,
      status: body.status || 'backlog',
      type: body.type || 'development',
      assigned_to: body.assigned_to,
      estimated_hours: body.estimated_hours,
      due_date: body.due_date || null,
      blockers: body.blockers,
      technical_notes: body.technical_notes,
      dependencies: body.dependencies || [],
      tags: body.tags || []
    }

    // Validate required fields
    if (!subtaskData.task_id || !subtaskData.title) {
      return NextResponse.json(
        { error: 'Task ID and sub-task title are required' },
        { status: 400 }
      )
    }

    // Insert sub-task
    const { data: subtask, error: subtaskError } = await supabase
      .from('sub_tasks')
      .insert(subtaskData)
      .select(`
        *,
        tasks (
          title,
          features (
            name,
            epics (name, color)
          )
        )
      `)
      .single()

    if (subtaskError) {
      return NextResponse.json({ error: subtaskError.message }, { status: 400 })
    }

    return NextResponse.json(subtask)
  } catch (error) {
    console.error('Error creating sub-task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}