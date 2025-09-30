import { NextResponse } from 'next/server';

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
  },
  {
    id: '2',
    company: {
      id: 'design-studio',
      name: 'Creative Design Studio',
      logo: '/logos/design-studio.png',
      department: 'Design'
    },
    title: 'UX/UI Designer',
    description: 'Seeking a creative UX/UI designer to craft exceptional user experiences.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Portfolio showcasing mobile and web designs',
      'Understanding of user research methods'
    ],
    location: 'New York, NY',
    salary_range: { min: 80000, max: 120000 },
    employment_type: 'full-time',
    interview_process: [
      'Portfolio Review (45 min)',
      'Design Challenge (90 min)',
      'Team Collaboration Interview (30 min)',
      'Final Interview with Design Director (30 min)'
    ],
    status: 'active',
    posted_date: '2024-01-20',
    deadline: '2024-02-20',
    slots_available: 3,
    applications_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get('company');
  const status = searchParams.get('status');

  let filteredPostings = interviewPostings;

  if (company) {
    filteredPostings = filteredPostings.filter(posting =>
      posting.company.id === company || posting.company.name.toLowerCase().includes(company.toLowerCase())
    );
  }

  if (status) {
    filteredPostings = filteredPostings.filter(posting => posting.status === status);
  }

  return NextResponse.json({
    success: true,
    data: filteredPostings,
    total: filteredPostings.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newPosting = {
      id: Date.now().toString(),
      company: body.company,
      title: body.title,
      description: body.description,
      requirements: body.requirements || [],
      location: body.location,
      salary_range: body.salary_range || { min: 0, max: 0 },
      employment_type: body.employment_type || 'full-time',
      interview_process: body.interview_process || [],
      status: 'active',
      posted_date: new Date().toISOString().split('T')[0],
      deadline: body.deadline,
      slots_available: body.slots_available || 1,
      applications_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    interviewPostings.push(newPosting);

    return NextResponse.json({
      success: true,
      data: newPosting,
      message: 'Interview posting created successfully'
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Failed to create interview posting'
    }, { status: 500 });
  }
}