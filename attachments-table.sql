-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    file_path TEXT NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'failed')),
    user_identifier VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attachments_ticket_id ON attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_attachments_user_identifier ON attachments(user_identifier);
CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attachments_upload_status ON attachments(upload_status);
CREATE INDEX IF NOT EXISTS idx_attachments_mime_type ON attachments(mime_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_attachments_updated_at
    BEFORE UPDATE ON attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attachments
-- Allow all operations since we removed auth
CREATE POLICY "Allow all operations on attachments" ON attachments
    FOR ALL USING (true);

-- Add comments for documentation
COMMENT ON TABLE attachments IS 'Stores file attachments associated with tickets';
COMMENT ON COLUMN attachments.id IS 'Unique identifier for the attachment';
COMMENT ON COLUMN attachments.ticket_id IS 'Foreign key reference to tickets table';
COMMENT ON COLUMN attachments.filename IS 'Generated filename for storage (UUID-based)';
COMMENT ON COLUMN attachments.original_name IS 'Original filename as uploaded by user';
COMMENT ON COLUMN attachments.file_size IS 'File size in bytes';
COMMENT ON COLUMN attachments.mime_type IS 'MIME type of the file';
COMMENT ON COLUMN attachments.file_path IS 'Full path to the stored file';
COMMENT ON COLUMN attachments.upload_status IS 'Status of the file upload process';
COMMENT ON COLUMN attachments.user_identifier IS 'Identifier of the user who uploaded the file';
COMMENT ON COLUMN attachments.metadata IS 'Additional metadata about the file (e.g., width/height for images)';