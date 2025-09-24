# Ticket System Backend

A FastAPI backend for the ticket management system with PostgreSQL database.

## Features

- RESTful API for ticket management
- Draft saving functionality
- Voice note upload and management
- PostgreSQL database with SQLAlchemy ORM
- CORS enabled for frontend integration
- File upload handling

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Setup**
   - Install PostgreSQL
   - Create a database named `ticket_db`
   - Update the `DATABASE_URL` in `.env` file

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run the Application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Tickets
- `POST /api/v1/tickets/` - Create a new ticket
- `GET /api/v1/tickets/` - Get all tickets
- `GET /api/v1/tickets/{id}` - Get a specific ticket
- `PUT /api/v1/tickets/{id}` - Update a ticket
- `DELETE /api/v1/tickets/{id}` - Delete a ticket

### Drafts
- `POST /api/v1/drafts/` - Save a draft
- `GET /api/v1/drafts/` - Get the current draft
- `PUT /api/v1/drafts/` - Update the current draft
- `DELETE /api/v1/drafts/` - Delete the current draft

### Voice Notes
- `POST /api/v1/voice-notes/upload` - Upload a voice note
- `GET /api/v1/voice-notes/{filename}` - Download a voice note
- `DELETE /api/v1/voice-notes/{filename}` - Delete a voice note

## Database Schema

### Tables
- `tickets` - Main ticket information
- `drafts` - Saved drafts (only one active at a time)
- `voice_notes` - Uploaded voice note files

### Ticket Fields
- `id` - Primary key
- `subject` - Ticket subject (required)
- `description` - Ticket description (required)
- `priority` - Low, Medium, High
- `type` - Question, Incident, Problem, Feature Request, Unspecified
- `status` - Open, In Progress, Pending, Resolved, Closed
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Development

The API documentation is available at `http://localhost:8000/docs` when running the development server.

## File Uploads

Voice notes are stored in the `uploads/` directory and served statically. The maximum file size is 10MB by default.