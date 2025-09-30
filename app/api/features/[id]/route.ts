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

    const { data: feature, error: featureError } = await supabase
      .from('features')
      .select(`
        *,
        epics (
          id,
          name
        ),
        tasks (
          *,
          sub_tasks (*)
        ),
        tickets (
          id,
          subject,
          description,
          status,
          priority,
          type,
          user_story_ref,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (featureError) {
      if (featureError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
      }
      return NextResponse.json({ error: featureError.message }, { status: 400 })
    }

    // Calculate metrics for the feature
    const totalTasks = feature.tasks?.length || 0
    const completedTasks = feature.tasks?.filter(t => t.status === 'done').length || 0

    let totalSubTasks = 0
    let completedSubTasks = 0

    feature.tasks?.forEach(task => {
      totalSubTasks += task.sub_tasks?.length || 0
      completedSubTasks += task.sub_tasks?.filter(st => st.status === 'done').length || 0
    })

    const userStories = feature.user_stories || []
    const totalStories = userStories.length
    const completedStories = userStories.filter(s => s.status === 'done').length

    const enrichedFeature = {
      ...feature,
      metrics: {
        totalTasks,
        completedTasks,
        totalStories,
        completedStories,
        totalSubTasks,
        completedSubTasks,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        storyCompletionRate: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0
      }
    }

    return NextResponse.json(enrichedFeature)
  } catch (error) {
    console.error('Error fetching feature:', error)
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
      capability_description: body.capability_description,
      business_value: body.business_value,
      status: body.status,
      priority: body.priority,
      start_date: body.start_date,
      target_completion: body.target_completion,
      feature_owner: body.feature_owner,
      estimated_story_points: body.estimated_story_points,
      user_stories: body.user_stories
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data: feature, error: featureError } = await supabase
      .from('features')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        epics (
          id,
          name
        ),
        tasks (
          *,
          sub_tasks (*)
        ),
        tickets (
          id,
          subject,
          description,
          status,
          priority,
          type,
          user_story_ref,
          created_at
        )
      `)
      .single()

    if (featureError) {
      if (featureError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
      }
      return NextResponse.json({ error: featureError.message }, { status: 400 })
    }

    // Calculate metrics for the updated feature
    const totalTasks = feature.tasks?.length || 0
    const completedTasks = feature.tasks?.filter(t => t.status === 'done').length || 0

    let totalSubTasks = 0
    let completedSubTasks = 0

    feature.tasks?.forEach(task => {
      totalSubTasks += task.sub_tasks?.length || 0
      completedSubTasks += task.sub_tasks?.filter(st => st.status === 'done').length || 0
    })

    const userStories = feature.user_stories || []
    const totalStories = userStories.length
    const completedStories = userStories.filter(s => s.status === 'done').length

    const enrichedFeature = {
      ...feature,
      metrics: {
        totalTasks,
        completedTasks,
        totalStories,
        completedStories,
        totalSubTasks,
        completedSubTasks,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        storyCompletionRate: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0
      }
    }

    return NextResponse.json(enrichedFeature)
  } catch (error) {
    console.error('Error updating feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { error: deleteError } = await supabase
      .from('features')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}