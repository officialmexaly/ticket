import { NextResponse } from 'next/server';

const candidates = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    experience_years: 6,
    current_company: 'StartupXYZ',
    current_position: 'Senior Developer',
    location: 'San Francisco, CA',
    source: 'linkedin',
    stage: 'interview',
    salary_expectation: 150000,
    availability: '2_weeks',
    rating: 4.5,
    notes: 'Strong technical background, excellent communication skills',
    // Interview posting assignment
    applied_posting_id: '1',
    assigned_company: {
      id: 'tech-corp',
      name: 'TechCorp Inc.',
      department: 'Engineering'
    },
    interview_status: 'scheduled',
    interview_date: '2024-02-01T10:00:00Z',
    interview_stage: 'technical_assessment',
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-25T14:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0456',
    skills: ['UX Design', 'Figma', 'User Research', 'Prototyping'],
    experience_years: 4,
    current_company: 'Design Agency',
    current_position: 'UX Designer',
    location: 'New York, NY',
    source: 'referral',
    stage: 'interested',
    salary_expectation: 95000,
    availability: '1_month',
    rating: 4.8,
    notes: 'Exceptional portfolio, great design thinking',
    // Interview posting assignment
    applied_posting_id: '2',
    assigned_company: {
      id: 'design-studio',
      name: 'Creative Design Studio',
      department: 'Design'
    },
    interview_status: 'pending_schedule',
    interview_date: null,
    interview_stage: 'portfolio_review',
    created_at: '2024-01-22T11:00:00Z',
    updated_at: '2024-01-26T16:45:00Z'
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');
  const posting_id = searchParams.get('posting_id');
  const stage = searchParams.get('stage');

  let filteredCandidates = candidates;

  if (company) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.assigned_company?.id === company ||
      candidate.assigned_company?.name.toLowerCase().includes(company.toLowerCase())
    );
  }

  if (posting_id) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.applied_posting_id === posting_id
    );
  }

  if (stage) {
    filteredCandidates = filteredCandidates.filter(candidate => candidate.stage === stage);
  }

  return NextResponse.json({
    success: true,
    data: filteredCandidates,
    total: filteredCandidates.length
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Auto-assign company based on posting
    let assignedCompany = null;
    if (body.applied_posting_id) {
      // In a real app, you'd fetch the posting from the database
      const postingResponse = await fetch(`${request.url.replace('/candidates', '/interview-postings')}/${body.applied_posting_id}`);
      if (postingResponse.ok) {
        const postingData = await postingResponse.json();
        assignedCompany = postingData.data?.company;
      }
    }

    const newCandidate = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      skills: body.skills || [],
      experience_years: body.experience_years || 0,
      current_company: body.current_company,
      current_position: body.current_position,
      location: body.location,
      source: body.source || 'direct',
      stage: 'sourced',
      salary_expectation: body.salary_expectation,
      availability: body.availability || 'not_available',
      rating: body.rating,
      notes: body.notes,
      // Auto-assignment based on posting
      applied_posting_id: body.applied_posting_id,
      assigned_company: assignedCompany,
      interview_status: body.applied_posting_id ? 'pending_schedule' : null,
      interview_date: null,
      interview_stage: body.applied_posting_id ? 'initial_screening' : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    candidates.push(newCandidate);

    return NextResponse.json({
      success: true,
      data: newCandidate,
      message: 'Candidate created successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create candidate'
    }, { status: 500 });
  }
}