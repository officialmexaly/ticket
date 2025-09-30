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

    const { data: epic, error: epicError } = await supabase
      .from('epics')
      .select(`
        *,
        features (
          *,
          tasks (
            *,
            sub_tasks (*)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (epicError) {
      if (epicError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Epic not found' }, { status: 404 })
      }
      return NextResponse.json({ error: epicError.message }, { status: 400 })
    }

    // Calculate metrics for the epic
    const totalFeatures = epic.features?.length || 0
    const completedFeatures = epic.features?.filter(f => f.status === 'done').length || 0

    let totalTasks = 0
    let completedTasks = 0
    let totalSubTasks = 0
    let completedSubTasks = 0
    let totalStories = 0
    let completedStories = 0

    epic.features?.forEach(feature => {
      // Count user stories from JSONB array
      const userStories = feature.user_stories || []
      totalStories += userStories.length
      completedStories += userStories.filter(s => s.status === 'done').length

      // Count tasks and sub-tasks
      totalTasks += feature.tasks?.length || 0
      completedTasks += feature.tasks?.filter(t => t.status === 'done').length || 0

      feature.tasks?.forEach(task => {
        totalSubTasks += task.sub_tasks?.length || 0
        completedSubTasks += task.sub_tasks?.filter(st => st.status === 'done').length || 0
      })
    })

    const enrichedEpic = {
      ...epic,
      metrics: {
        totalFeatures,
        completedFeatures,
        totalStories,
        completedStories,
        totalTasks,
        completedTasks,
        totalSubTasks,
        completedSubTasks,
        featureCompletionRate: totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0,
        storyCompletionRate: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    }

    return NextResponse.json(enrichedEpic)
  } catch (error) {
    console.error('Error fetching epic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updateData = {
      name: body.name,
      description: body.description,
      vision: body.vision,
      business_goal: body.business_goal,
      status: body.status,
      priority: body.priority,
      start_date: body.start_date,
      target_completion: body.target_completion,
      epic_owner: body.epic_owner,
      stakeholders: body.stakeholders,
      budget: body.budget
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data: epic, error: epicError } = await supabase
      .from('epics')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        features (
          *,
          tasks (
            *,
            sub_tasks (*)
          )
        )
      `)
      .single()

    if (epicError) {
      if (epicError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Epic not found' }, { status: 404 })
      }
      return NextResponse.json({ error: epicError.message }, { status: 400 })
    }

    // Calculate metrics for the updated epic
    const totalFeatures = epic.features?.length || 0
    const completedFeatures = epic.features?.filter(f => f.status === 'done').length || 0

    let totalTasks = 0
    let completedTasks = 0
    let totalSubTasks = 0
    let completedSubTasks = 0
    let totalStories = 0
    let completedStories = 0

    epic.features?.forEach(feature => {
      const userStories = feature.user_stories || []
      totalStories += userStories.length
      completedStories += userStories.filter(s => s.status === 'done').length

      totalTasks += feature.tasks?.length || 0
      completedTasks += feature.tasks?.filter(t => t.status === 'done').length || 0

      feature.tasks?.forEach(task => {
        totalSubTasks += task.sub_tasks?.length || 0
        completedSubTasks += task.sub_tasks?.filter(st => st.status === 'done').length || 0
      })
    })

    const enrichedEpic = {
      ...epic,
      metrics: {
        totalFeatures,
        completedFeatures,
        totalStories,
        completedStories,
        totalTasks,
        completedTasks,
        totalSubTasks,
        completedSubTasks,
        featureCompletionRate: totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0,
        storyCompletionRate: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    }

    return NextResponse.json(enrichedEpic)
  } catch (error) {
    console.error('Error updating epic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { error: deleteError } = await supabase
      .from('epics')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Epic deleted successfully' })
  } catch (error) {
    console.error('Error deleting epic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}