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
    const feature_id = searchParams.get('feature_id')
    const status = searchParams.get('status')
    const sprint_id = searchParams.get('sprint_id')
    const assigned_to = searchParams.get('assigned_to')

    let query = supabase
      .from('user_stories')
      .select(`
        *,
        features (
          name,
          epics (name, color)
        ),
        sub_tasks (*),
        tickets (*)
      `)
      .order('created_at', { ascending: false })

    if (feature_id) {
      query = query.eq('feature_id', feature_id)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (sprint_id) {
      query = query.eq('sprint_id', sprint_id)
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to)
    }

    const { data: userStories, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate metrics for each user story
    const enrichedStories = userStories.map(story => {
      const totalSubTasks = story.sub_tasks?.length || 0
      const completedSubTasks = story.sub_tasks?.filter(t => t.status === 'done').length || 0
      const totalTickets = story.tickets?.length || 0
      const completedTickets = story.tickets?.filter(t => t.status === 'Closed').length || 0

      const totalEstimatedHours = story.sub_tasks?.reduce((sum, task) =>
        sum + (parseFloat(task.estimated_hours) || 0), 0) || 0
      const totalActualHours = story.sub_tasks?.reduce((sum, task) =>
        sum + (parseFloat(task.actual_hours) || 0), 0) || 0

      return {
        ...story,
        metrics: {
          totalSubTasks,
          completedSubTasks,
          totalTickets,
          completedTickets,
          totalEstimatedHours,
          totalActualHours,
          subTaskCompletionRate: totalSubTasks > 0 ? Math.round((completedSubTasks / totalSubTasks) * 100) : 0,
          ticketCompletionRate: totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0
        }
      }
    })

    return NextResponse.json(enrichedStories)
  } catch (error) {
    console.error('Error fetching user stories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const storyData = {
      feature_id: body.feature_id,
      title: body.title,
      user_story: body.user_story,
      acceptance_criteria: body.acceptance_criteria,
      status: body.status || 'backlog',
      priority: body.priority || 'Medium',
      story_points: body.story_points || 0,
      assigned_to: body.assigned_to,
      sprint_id: body.sprint_id,
      estimated_hours: body.estimated_hours,
      definition_of_done: body.definition_of_done,
      business_value_score: body.business_value_score || 0,
      technical_risk_score: body.technical_risk_score || 0,
      dependencies: body.dependencies || [],
      tags: body.tags || []
    }

    // Validate required fields
    if (!storyData.feature_id || !storyData.title || !storyData.user_story || !storyData.acceptance_criteria) {
      return NextResponse.json(
        { error: 'Feature ID, title, user story, and acceptance criteria are required' },
        { status: 400 }
      )
    }

    // Insert user story
    const { data: userStory, error: storyError } = await supabase
      .from('user_stories')
      .insert(storyData)
      .select(`
        *,
        features (
          name,
          epics (name, color)
        ),
        sub_tasks (*),
        tickets (*)
      `)
      .single()

    if (storyError) {
      return NextResponse.json({ error: storyError.message }, { status: 400 })
    }

    return NextResponse.json(userStory)
  } catch (error) {
    console.error('Error creating user story:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}