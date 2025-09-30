# Interview Recruitment System

## Overview

The Interview Recruitment System is a comprehensive solution that automatically assigns candidates to companies based on the interview postings they apply to. This eliminates manual assignment errors and streamlines the recruitment process.

## Key Features

### 🎯 **Automated Assignment Flow**
- **Interview Postings**: HR creates job postings linked to specific companies
- **Candidate Applications**: Candidates apply to specific postings
- **Auto-Assignment**: System automatically assigns candidates to the posting's company
- **Interview Pipeline**: Company-specific interview processes begin automatically

### 📋 **Interview Posting Management**
- Create and manage job postings with company assignment
- Define interview processes and requirements
- Set salary ranges and application deadlines
- Track application counts and posting status

### 👥 **Candidate Tracking**
- View all candidates assigned to companies
- Track interview stages and progress
- Monitor candidate ratings and feedback
- Manage interview scheduling

### 🏢 **Company-Based Organization**
- Each posting belongs to a specific company
- Candidates are automatically routed to the correct company
- Separate interview pipelines per company
- Clear audit trail from application to hire

## API Endpoints

### Interview Postings
- `GET /api/interview-postings` - List all postings
- `POST /api/interview-postings` - Create new posting
- `GET /api/interview-postings/[id]` - Get specific posting
- `PUT /api/interview-postings/[id]` - Update posting
- `DELETE /api/interview-postings/[id]` - Delete posting

### Candidates
- `GET /api/candidates` - List all candidates (with company filtering)
- `POST /api/candidates` - Create candidate with auto-assignment
- `GET /api/candidates/[id]` - Get specific candidate
- `PUT /api/candidates/[id]` - Update candidate (handles posting assignment)
- `DELETE /api/candidates/[id]` - Delete candidate

## Components

### Main Components
- `RecruitmentDashboard` - Main dashboard with tabs for overview, postings, and candidates
- `InterviewPostingManager` - Complete CRUD interface for managing job postings
- `CandidateAssignmentView` - View and manage candidate assignments to companies

### Data Models

#### Interview Posting
```typescript
interface InterviewPosting {
  id: string;
  company: {
    id: string;
    name: string;
    department: string;
  };
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary_range: { min: number; max: number };
  employment_type: string;
  interview_process: string[];
  status: 'active' | 'paused' | 'closed';
  posted_date: string;
  deadline: string;
  slots_available: number;
  applications_count: number;
}
```

#### Candidate
```typescript
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
  source: string;
  stage: string;
  salary_expectation?: number;
  availability: string;
  rating?: number;
  notes?: string;
  // Auto-assignment fields
  applied_posting_id?: string;
  assigned_company?: Company;
  interview_status?: string;
  interview_date?: string;
  interview_stage?: string;
}
```

## Assignment Logic

### How It Works

1. **Posting Creation**: HR creates an interview posting and selects the target company
2. **Candidate Application**: Candidate applies to the specific posting
3. **Automatic Assignment**:
   - System reads the posting's company information
   - Automatically assigns candidate to that company
   - Sets initial interview status to "pending_schedule"
   - Updates candidate stage to "interview"
4. **Interview Process**: Company-specific interview workflow begins

### Benefits

- ✅ **No Manual Errors**: Eliminates human error in candidate routing
- ✅ **Clear Audit Trail**: Full tracking from application to hire
- ✅ **Faster Processing**: Automated workflow reduces time-to-hire
- ✅ **Company Isolation**: Each company has its own candidate pipeline
- ✅ **Scalable**: Works with multiple companies and departments

## Navigation

Access the recruitment system through:
- **Sidebar**: "Interview Recruitment" link under HR Management section
- **Direct URL**: `/recruitment`
- **Dashboard**: Quick action buttons from overview tab

## Usage Flow

### For HR Managers

1. **Create Postings**:
   - Go to Interview Postings tab
   - Click "Create Posting"
   - Select target company
   - Define job requirements and interview process
   - Set application deadline and available slots

2. **Monitor Applications**:
   - View posting statistics and application counts
   - Track candidate flow per company
   - Manage posting status (active/paused/closed)

3. **Review Assignments**:
   - Switch to Candidate Assignments tab
   - View candidates assigned to each company
   - Monitor interview progress and stages
   - Update candidate information as needed

### For Hiring Managers

1. **Review Assigned Candidates**:
   - Filter by your company
   - View candidate profiles and qualifications
   - Check interview status and scheduled dates

2. **Manage Interview Process**:
   - Update interview stages and status
   - Schedule interviews and meetings
   - Add notes and ratings

## Integration

The recruitment system integrates with:
- **Existing HR Dashboard**: Seamless navigation between modules
- **User Management**: Leverages existing user roles and permissions
- **Notification System**: Alerts for new applications and interview updates
- **Analytics**: Tracking recruitment metrics and performance

## Future Enhancements

- **Email Integration**: Automated candidate communication
- **Calendar Sync**: Direct interview scheduling
- **Advanced Analytics**: Detailed recruitment reporting
- **Integration APIs**: Connect with external ATS systems
- **AI Matching**: Intelligent candidate-posting matching