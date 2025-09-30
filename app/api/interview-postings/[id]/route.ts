import { NextResponse } from 'next/server';

// This would typically connect to your database
const interviewPostings = [
  {
    id: '1',
    company: {
      id: 'tech-corp',
      name: 'TechCorp Inc.',
      logo: '/logos/techcorp.png',
      department: 'Engineering'
    },
    title: 'Senior Full Stack Developer',
    description: 'Looking for an experienced full stack developer to join our growing team.',
    requirements: [
      '5+ years of React/Node.js experience',
      'Strong TypeScript skills',
      'Experience with cloud platforms (AWS/Azure)',
      'Team leadership experience preferred'
    ],
    location: 'San Francisco, CA / Remote',
    salary_range: { min: 120000, max: 180000 },
    employment_type: 'full-time',
    interview_process: [
      'Initial HR Screening (30 min)',
      'Technical Assessment (60 min)',
      'System Design Interview (45 min)',
      'Cultural Fit Interview (30 min)',
      'Final Interview with CTO (30 min)'
    ],
    status: 'active',
    posted_date: '2024-01-15',
    deadline: '2024-02-15',
    slots_available: 5,
    applications_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request, { params }) {
  const { id } = params;

  const posting = interviewPostings.find(p => p.id === id);

  if (!posting) {
    return NextResponse.json({
      success: false,
      error: 'Interview posting not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: posting
  });
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const postingIndex = interviewPostings.findIndex(p => p.id === id);

    if (postingIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Interview posting not found'
      }, { status: 404 });
    }

    const updatedPosting = {
      ...interviewPostings[postingIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    interviewPostings[postingIndex] = updatedPosting;

    return NextResponse.json({
      success: true,
      data: updatedPosting,
      message: 'Interview posting updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update interview posting'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const postingIndex = interviewPostings.findIndex(p => p.id === id);

    if (postingIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Interview posting not found'
      }, { status: 404 });
    }

    interviewPostings.splice(postingIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Interview posting deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete interview posting'
    }, { status: 500 });
  }
}