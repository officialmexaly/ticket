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
    const project_id = searchParams.get('project_id')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let query = supabase
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
      .order('created_at', { ascending: false })
    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }

    const { data: epics, error: epicsError } = await query

    if (epicsError) {
      return NextResponse.json({ error: epicsError.message }, { status: 400 })
    }

    // Calculate metrics for each epic
    const enrichedEpics = epics.map(epic => {
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

      return {
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
    })

    return NextResponse.json(enrichedEpics)
  } catch (error) {
    console.error('Error fetching epics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const epicData = {
      name: body.name,
      description: body.description,
      vision: body.vision,
      business_goal: body.business_goal,
      status: body.status || 'planning',
      priority: body.priority || 'Medium',
      start_date: body.start_date || null,
      target_completion: body.target_completion || null,
      epic_owner: body.epic_owner,
      stakeholders: body.stakeholders || [],
      budget: body.budget,
      color: body.color || '#8B5CF6',
      tags: body.tags || [],
      dependencies: body.dependencies || []
    }

    // Validate required fields
    if (!epicData.name) {
      return NextResponse.json(
        { error: 'Epic name is required' },
        { status: 400 }
      )
    }

    // Insert epic
    const { data: epic, error: epicError } = await supabase
      .from('epics')
      .insert(epicData)
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
      return NextResponse.json({ error: epicError.message }, { status: 400 })
    }

    // Broadcast epic creation
    try {
      await supabase
        .channel('dashboard-updates')
        .send({
          type: 'broadcast',
          event: 'epic_created',
          payload: {
            epic: epic,
            timestamp: new Date().toISOString()
          }
        })
    } catch (broadcastError) {
      console.error('Failed to send epic broadcast:', broadcastError)
    }

    return NextResponse.json(epic)
  } catch (error) {
    console.error('Error creating epic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}