import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const { id: projectId } = params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assigned_to')
    const milestoneId = searchParams.get('milestone_id')

    let query = supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    // Add filters if provided
    if (status) {
      query = query.eq('status', status)
    }
    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }
    if (milestoneId) {
      query = query.eq('milestone_id', milestoneId)
    }

    const { data: tasks, error: tasksError } = await query

    if (tasksError) {
      return NextResponse.json({ error: tasksError.message }, { status: 400 })
    }

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching project tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id: projectId } = params
    const body = await request.json()

    const taskData = {
      project_id: projectId,
      milestone_id: body.milestone_id,
      title: body.title,
      description: body.description,
      status: body.status || 'backlog',
      priority: body.priority || 'Medium',
      assigned_to: body.assigned_to,
      estimated_hours: body.estimated_hours,
      due_date: body.due_date,
      dependencies: body.dependencies || [],
      tags: body.tags || []
    }

    // Validate required fields
    if (!taskData.title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    // Insert task
    const { data: task, error: taskError } = await supabase
      .from('project_tasks')
      .insert(taskData)
      .select()
      .single()

    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 400 })
    }

    // Create notification for task assignment
    if (taskData.assigned_to) {
      try {
        await supabase
          .from('notifications')
          .insert({
            title: 'New Task Assigned',
            message: `You have been assigned task: "${task.title}"`,
            type: 'system',
            user_identifier: taskData.assigned_to,
            metadata: { task_id: task.id, project_id: projectId }
          })
      } catch (notificationError) {
        console.error('Error creating task assignment notification:', notificationError)
      }
    }

    // Broadcast task creation
    try {
      await supabase
        .channel('dashboard-updates')
        .send({
          type: 'broadcast',
          event: 'task_created',
          payload: {
            task: task,
            projectId: projectId,
            timestamp: new Date().toISOString()
          }
        })
    } catch (broadcastError) {
      console.error('Failed to send task broadcast:', broadcastError)
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}