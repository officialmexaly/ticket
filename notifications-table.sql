-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('ticket_created', 'ticket_updated', 'ticket_deleted', 'system', 'info')),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_identifier VARCHAR(255),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_identifier ON notifications(user_identifier);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_ticket_id ON notifications(ticket_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
-- Allow all operations since we removed auth
CREATE POLICY "Allow all operations on notifications" ON notifications
    FOR ALL USING (true);

-- Optional: Create a function to automatically create notifications when tickets are created
CREATE OR REPLACE FUNCTION create_ticket_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        title,
        message,
        type,
        ticket_id,
        user_identifier
    ) VALUES (
        'New Ticket Created',
        'A new ticket "' || NEW.subject || '" has been created with ' || NEW.priority || ' priority',
        'ticket_created',
        NEW.id,
        NEW.user_identifier
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create notifications when tickets are inserted
DROP TRIGGER IF EXISTS trigger_create_ticket_notification ON tickets;
CREATE TRIGGER trigger_create_ticket_notification
    AFTER INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION create_ticket_notification();

-- Optional: Create a function to create notifications when tickets are updated
CREATE OR REPLACE FUNCTION create_ticket_update_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create notification if status changed
    IF OLD.status != NEW.status THEN
        INSERT INTO notifications (
            title,
            message,
            type,
            ticket_id,
            user_identifier
        ) VALUES (
            'Ticket Status Updated',
            'Ticket "' || NEW.subject || '" status changed from ' || OLD.status || ' to ' || NEW.status,
            'ticket_updated',
            NEW.id,
            NEW.user_identifier
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket updates
DROP TRIGGER IF EXISTS trigger_create_ticket_update_notification ON tickets;
CREATE TRIGGER trigger_create_ticket_update_notification
    AFTER UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION create_ticket_update_notification();

-- Optional: Create a function to create notifications when tickets are deleted
CREATE OR REPLACE FUNCTION create_ticket_delete_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        title,
        message,
        type,
        user_identifier
    ) VALUES (
        'Ticket Deleted',
        'Ticket "' || OLD.subject || '" has been deleted',
        'ticket_deleted',
        OLD.user_identifier
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket deletions
DROP TRIGGER IF EXISTS trigger_create_ticket_delete_notification ON tickets;
CREATE TRIGGER trigger_create_ticket_delete_notification
    AFTER DELETE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION create_ticket_delete_notification();