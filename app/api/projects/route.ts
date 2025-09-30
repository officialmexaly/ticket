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
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let query = supabase
      .from('projects')
      .select(`
        *,
        epics (
          *,
          features (
            *,
            user_stories (
              *,
              tasks (
                *,
                sub_tasks (*)
              )
            )
          )
        )
      `)
      .order('created_at', { ascending: false })

    // Add filters if provided
    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }

    const { data: projects, error: projectsError } = await query

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 400 })
    }

    // Calculate metrics for each project
    const enrichedProjects = projects.map(project => {
      const totalEpics = project.epics?.length || 0
      const completedEpics = project.epics?.filter(e => e.status === 'completed').length || 0

      let totalFeatures = 0
      let completedFeatures = 0
      let totalStories = 0
      let completedStories = 0
      let totalTasks = 0
      let completedTasks = 0
      let totalSubTasks = 0
      let completedSubTasks = 0
      let totalStoryPoints = 0
      let completedStoryPoints = 0

      project.epics?.forEach(epic => {
        totalFeatures += epic.features?.length || 0
        completedFeatures += epic.features?.filter(f => f.status === 'done').length || 0

        epic.features?.forEach(feature => {
          totalStories += feature.user_stories?.length || 0
          completedStories += feature.user_stories?.filter(s => s.status === 'done').length || 0

          feature.user_stories?.forEach(story => {
            totalStoryPoints += story.story_points || 0
            if (story.status === 'done') {
              completedStoryPoints += story.story_points || 0
            }

            totalTasks += story.tasks?.length || 0
            completedTasks += story.tasks?.filter(t => t.status === 'done').length || 0

            story.tasks?.forEach(task => {
              totalSubTasks += task.sub_tasks?.length || 0
              completedSubTasks += task.sub_tasks?.filter(st => st.status === 'done').length || 0
            })
          })
        })
      })

      return {
        ...project,
        metrics: {
          totalEpics,
          completedEpics,
          totalFeatures,
          completedFeatures,
          totalStories,
          completedStories,
          totalTasks,
          completedTasks,
          totalSubTasks,
          completedSubTasks,
          totalStoryPoints,
          completedStoryPoints,
          epicCompletionRate: totalEpics > 0 ? Math.round((completedEpics / totalEpics) * 100) : 0,
          featureCompletionRate: totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0,
          storyCompletionRate: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0,
          taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          velocity: completedStoryPoints
        }
      }
    })

    return NextResponse.json(enrichedProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const projectData = {
      name: body.name,
      description: body.description,
      status: body.status || 'planning',
      priority: body.priority || 'Medium',
      start_date: body.start_date,
      target_completion: body.target_completion,
      business_value: body.business_value,
      success_criteria: body.success_criteria,
      project_manager: body.project_manager,
      stakeholders: body.stakeholders || [],
      budget: body.budget,
      color: body.color || '#3B82F6',
      tags: body.tags || []
    }

    // Validate required fields
    if (!projectData.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select(`
        *,
        epics (
          *,
          features (
            *,
            user_stories (
              *,
              tasks (
                *,
                sub_tasks (*)
              )
            )
          )
        )
      `)
      .single()

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 400 })
    }

    // Broadcast project creation
    try {
      await supabase
        .channel('dashboard-updates')
        .send({
          type: 'broadcast',
          event: 'project_created',
          payload: {
            project: project,
            timestamp: new Date().toISOString()
          }
        })
    } catch (broadcastError) {
      console.error('Failed to send project broadcast:', broadcastError)
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}