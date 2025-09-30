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

export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        project_milestones (*),
        project_tasks (*),
        tickets (*)
      `)
      .eq('id', id)
      .single()

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 400 })
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Calculate detailed metrics
    const totalTasks = project.project_tasks?.length || 0
    const tasksByStatus = {
      backlog: project.project_tasks?.filter(t => t.status === 'backlog').length || 0,
      todo: project.project_tasks?.filter(t => t.status === 'todo').length || 0,
      in_progress: project.project_tasks?.filter(t => t.status === 'in_progress').length || 0,
      completed: project.project_tasks?.filter(t => t.status === 'completed').length || 0,
      qa: project.project_tasks?.filter(t => t.status === 'qa').length || 0,
      done: project.project_tasks?.filter(t => t.status === 'done').length || 0
    }

    const totalHoursEstimated = project.project_tasks?.reduce((sum, task) =>
      sum + (parseFloat(task.estimated_hours) || 0), 0) || 0
    const totalHoursActual = project.project_tasks?.reduce((sum, task) =>
      sum + (parseFloat(task.actual_hours) || 0), 0) || 0

    const enrichedProject = {
      ...project,
      metrics: {
        totalTasks,
        tasksByStatus,
        totalHoursEstimated,
        totalHoursActual,
        totalTickets: project.tickets?.length || 0,
        openTickets: project.tickets?.filter(t => t.status === 'Open').length || 0,
        totalMilestones: project.project_milestones?.length || 0,
        completedMilestones: project.project_milestones?.filter(m => m.status === 'completed').length || 0
      }
    }

    return NextResponse.json(enrichedProject)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    const updateData = {
      name: body.name,
      description: body.description,
      status: body.status,
      priority: body.priority,
      start_date: body.start_date,
      end_date: body.end_date,
      deadline: body.deadline,
      budget: body.budget,
      spent_budget: body.spent_budget,
      progress_percentage: body.progress_percentage,
      project_manager_identifier: body.project_manager_identifier,
      team_members: body.team_members,
      tags: body.tags,
      color: body.color
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    )

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        project_milestones (*),
        project_tasks (*),
        tickets (*)
      `)
      .single()

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 400 })
    }

    // Broadcast project update
    try {
      await supabase
        .channel('dashboard-updates')
        .send({
          type: 'broadcast',
          event: 'project_updated',
          payload: {
            project: project,
            timestamp: new Date().toISOString()
          }
        })
    } catch (broadcastError) {
      console.error('Failed to send project update broadcast:', broadcastError)
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 400 })
    }

    // Broadcast project deletion
    try {
      await supabase
        .channel('dashboard-updates')
        .send({
          type: 'broadcast',
          event: 'project_deleted',
          payload: {
            projectId: id,
            timestamp: new Date().toISOString()
          }
        })
    } catch (broadcastError) {
      console.error('Failed to send project deletion broadcast:', broadcastError)
    }

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}