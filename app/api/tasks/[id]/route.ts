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
    const { id } = await params

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        features (
          id,
          name,
          epics (
            id,
            name
          )
        ),
        sub_tasks (*)
      `)
      .eq('id', id)
      .single()

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
      return NextResponse.json({ error: taskError.message }, { status: 400 })
    }

    // Calculate metrics for the task
    const totalSubTasks = task.sub_tasks?.length || 0
    const completedSubTasks = task.sub_tasks?.filter(st => st.status === 'done').length || 0

    const enrichedTask = {
      ...task,
      metrics: {
        totalSubTasks,
        completedSubTasks,
        subTaskCompletionRate: totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0,
        estimatedVsActual: task.estimated_hours > 0 && task.actual_hours > 0
          ? Math.round((task.actual_hours / task.estimated_hours) * 100)
          : 0
      }
    }

    return NextResponse.json(enrichedTask)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData = {
      title: body.title,
      description: body.description,
      technical_work_description: body.technical_work_description,
      type: body.type,
      status: body.status,
      priority: body.priority,
      assigned_to: body.assigned_to,
      estimated_hours: body.estimated_hours,
      actual_hours: body.actual_hours,
      due_date: body.due_date
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        features (
          id,
          name,
          epics (
            id,
            name
          )
        ),
        sub_tasks (*)
      `)
      .single()

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
      return NextResponse.json({ error: taskError.message }, { status: 400 })
    }

    // Calculate metrics for the updated task
    const totalSubTasks = task.sub_tasks?.length || 0
    const completedSubTasks = task.sub_tasks?.filter(st => st.status === 'done').length || 0

    const enrichedTask = {
      ...task,
      metrics: {
        totalSubTasks,
        completedSubTasks,
        subTaskCompletionRate: totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0,
        estimatedVsActual: task.estimated_hours > 0 && task.actual_hours > 0
          ? Math.round((task.actual_hours / task.estimated_hours) * 100)
          : 0
      }
    }

    return NextResponse.json(enrichedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}