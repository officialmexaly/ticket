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
    const epic_id = searchParams.get('epic_id')
    const status = searchParams.get('status')

    let query = supabase
      .from('features')
      .select(`
        *,
        epics (name, color),
        tasks (
          *,
          sub_tasks (*)
        ),
        tickets (*)
      `)
      .order('created_at', { ascending: false })

    if (epic_id) {
      query = query.eq('epic_id', epic_id)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: features, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate metrics for each feature
    const enrichedFeatures = features.map(feature => {
      // User stories are now embedded as JSONB
      const userStories = feature.user_stories || []
      const totalStories = userStories.length
      const completedStories = userStories.filter(s => s.status === 'done').length

      let totalTasks = 0
      let completedTasks = 0
      let totalSubTasks = 0
      let completedSubTasks = 0
      let totalStoryPoints = 0
      let completedStoryPoints = 0

      // Calculate story points from embedded user stories
      userStories.forEach(story => {
        totalStoryPoints += story.story_points || 0
        if (story.status === 'done') {
          completedStoryPoints += story.story_points || 0
        }
      })

      // Calculate task metrics
      totalTasks = feature.tasks?.length || 0
      completedTasks = feature.tasks?.filter(t => t.status === 'done').length || 0

      feature.tasks?.forEach(task => {
        totalSubTasks += task.sub_tasks?.length || 0
        completedSubTasks += task.sub_tasks?.filter(st => st.status === 'done').length || 0
      })

      return {
        ...feature,
        metrics: {
          totalStories,
          completedStories,
          totalTasks,
          completedTasks,
          totalSubTasks,
          completedSubTasks,
          totalStoryPoints,
          completedStoryPoints,
          storyCompletionRate: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0,
          taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          velocity: completedStoryPoints
        }
      }
    })

    return NextResponse.json(enrichedFeatures)
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const featureData = {
      epic_id: body.epic_id,
      name: body.name,
      description: body.description,
      capability_description: body.capability_description,
      business_value: body.business_value,
      status: body.status || 'backlog',
      priority: body.priority || 'Medium',
      start_date: body.start_date || null,
      target_completion: body.target_completion || null,
      acceptance_criteria: body.acceptance_criteria,
      feature_owner: body.feature_owner,
      estimated_story_points: body.estimated_story_points || 0,
      color: body.color || '#10B981',
      tags: body.tags || [],
      dependencies: body.dependencies || [],
      user_stories: body.user_stories || []
    }

    // Validate required fields
    if (!featureData.epic_id || !featureData.name) {
      return NextResponse.json(
        { error: 'Epic ID and feature name are required' },
        { status: 400 }
      )
    }

    // Insert feature
    const { data: feature, error: featureError } = await supabase
      .from('features')
      .insert(featureData)
      .select(`
        *,
        epics (name, color),
        tasks (
          *,
          sub_tasks (*)
        )
      `)
      .single()

    if (featureError) {
      return NextResponse.json({ error: featureError.message }, { status: 400 })
    }

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error creating feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}