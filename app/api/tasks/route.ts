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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const feature_id = searchParams.get('feature_id')
    const status = searchParams.get('status')
    const assigned_to = searchParams.get('assigned_to')
    const user_story_ref = searchParams.get('user_story_ref')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        features (
          name,
          epics (name, color)
        ),
        sub_tasks (*)
      `)
      .order('created_at', { ascending: false })

    if (feature_id) {
      query = query.eq('feature_id', feature_id)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to)
    }
    if (user_story_ref) {
      query = query.eq('user_story_ref', user_story_ref)
    }

    const { data: tasks, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate metrics for each task
    const enrichedTasks = tasks.map(task => {
      const totalSubTasks = task.sub_tasks?.length || 0
      const completedSubTasks = task.sub_tasks?.filter(st => st.status === 'done').length || 0

      const totalEstimatedHours = task.sub_tasks?.reduce((sum, subTask) =>
        sum + (parseFloat(subTask.estimated_hours) || 0), 0) || 0
      const totalActualHours = task.sub_tasks?.reduce((sum, subTask) =>
        sum + (parseFloat(subTask.actual_hours) || 0), 0) || 0

      return {
        ...task,
        metrics: {
          totalSubTasks,
          completedSubTasks,
          totalEstimatedHours,
          totalActualHours,
          subTaskCompletionRate: totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0
        }
      }
    })

    return NextResponse.json(enrichedTasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const taskData = {
      feature_id: body.feature_id,
      user_story_ref: body.user_story_ref,
      title: body.title,
      description: body.description,
      technical_work_description: body.technical_work_description,
      status: body.status || 'backlog',
      type: body.type || 'development',
      priority: body.priority || 'Medium',
      assigned_to: body.assigned_to,
      estimated_hours: body.estimated_hours,
      due_date: body.due_date || null,
      blockers: body.blockers,
      dependencies: body.dependencies || [],
      tags: body.tags || []
    }

    // Validate required fields
    if (!taskData.feature_id || !taskData.title) {
      return NextResponse.json(
        { error: 'Feature ID and task title are required' },
        { status: 400 }
      )
    }

    // Insert task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert(taskData)
      .select(`
        *,
        features (
          name,
          epics (name, color)
        ),
        sub_tasks (*)
      `)
      .single()

    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 400 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}