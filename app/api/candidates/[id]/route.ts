import { NextResponse } from 'next/server';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience_years: number;
  current_company?: string;
  current_position?: string;
  location?: string;
  source?: string;
  stage?: string;
  salary_expectation?: number;
  availability?: string;
  rating?: number;
  notes?: string;
  applied_posting_id?: string;
  assigned_company?: {
    id: string;
    name: string;
    department: string;
  };
  interview_status?: string;
  interview_date?: string;
  interview_stage?: string;
  created_at?: string;
  updated_at?: string;
}

// This would typically connect to your database
const candidates: Candidate[] = [
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
  }
];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const candidate = candidates.find(c => c.id === id);

  if (!candidate) {
    return NextResponse.json({
      success: false,
      error: 'Candidate not found'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: candidate
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const candidateIndex = candidates.findIndex(c => c.id === id);

    if (candidateIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Candidate not found'
      }, { status: 404 });
    }

    // Handle posting assignment logic
    if (body.applied_posting_id && body.applied_posting_id !== candidates[candidateIndex].applied_posting_id) {
      // Fetch posting to get company info
      try {
        const postingResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/interview-postings/${body.applied_posting_id}`);
        if (postingResponse.ok) {
          const postingData = await postingResponse.json();
          if (postingData.success) {
            body.assigned_company = postingData.data.company;
            body.interview_status = 'pending_schedule';
            body.interview_stage = 'initial_screening';
            body.stage = 'interview';
          }
        }
      } catch (err) {
        console.error('Failed to fetch posting for assignment:', err);
      }
    }

    const updatedCandidate = {
      ...candidates[candidateIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    candidates[candidateIndex] = updatedCandidate;

    return NextResponse.json({
      success: true,
      data: updatedCandidate,
      message: 'Candidate updated successfully'
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Failed to update candidate'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const candidateIndex = candidates.findIndex(c => c.id === id);

    if (candidateIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Candidate not found'
      }, { status: 404 });
    }

    candidates.splice(candidateIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete candidate'
    }, { status: 500 });
  }
}