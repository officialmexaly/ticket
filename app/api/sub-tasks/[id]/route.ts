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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { data: subTask, error: subTaskError } = await supabase
      .from('sub_tasks')
      .select(`
        *,
        tasks (
          id,
          title,
          features (
            id,
            name,
            epics (
              id,
              name
            )
          )
        )
      `)
      .eq('id', id)
      .single()

    if (subTaskError) {
      if (subTaskError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Sub-task not found' }, { status: 404 })
      }
      return NextResponse.json({ error: subTaskError.message }, { status: 400 })
    }

    // Calculate metrics for the sub-task
    const enrichedSubTask = {
      ...subTask,
      metrics: {
        timeSpent: subTask.actual_hours || 0,
        estimatedVsActual: subTask.estimated_hours > 0 && subTask.actual_hours > 0
          ? Math.round((subTask.actual_hours / subTask.estimated_hours) * 100)
          : 0,
        efficiency: subTask.estimated_hours > 0 && subTask.actual_hours > 0
          ? Math.round((subTask.estimated_hours / subTask.actual_hours) * 100)
          : 0
      },
      time_logs: [] // This would be populated from a time_logs table if it exists
    }

    return NextResponse.json(enrichedSubTask)
  } catch (error) {
    console.error('Error fetching sub-task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData = {
      title: body.title,
      description: body.description,
      atomic_work_description: body.atomic_work_description,
      type: body.type,
      status: body.status,
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

    const { data: subTask, error: subTaskError } = await supabase
      .from('sub_tasks')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        tasks (
          id,
          title,
          features (
            id,
            name,
            epics (
              id,
              name
            )
          )
        )
      `)
      .single()

    if (subTaskError) {
      if (subTaskError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Sub-task not found' }, { status: 404 })
      }
      return NextResponse.json({ error: subTaskError.message }, { status: 400 })
    }

    // Calculate metrics for the updated sub-task
    const enrichedSubTask = {
      ...subTask,
      metrics: {
        timeSpent: subTask.actual_hours || 0,
        estimatedVsActual: subTask.estimated_hours > 0 && subTask.actual_hours > 0
          ? Math.round((subTask.actual_hours / subTask.estimated_hours) * 100)
          : 0,
        efficiency: subTask.estimated_hours > 0 && subTask.actual_hours > 0
          ? Math.round((subTask.estimated_hours / subTask.actual_hours) * 100)
          : 0
      },
      time_logs: [] // This would be populated from a time_logs table if it exists
    }

    return NextResponse.json(enrichedSubTask)
  } catch (error) {
    console.error('Error updating sub-task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { error: deleteError } = await supabase
      .from('sub_tasks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Sub-task deleted successfully' })
  } catch (error) {
    console.error('Error deleting sub-task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}