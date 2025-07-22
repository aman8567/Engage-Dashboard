-- Advanced CRM and Communication Tables
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    job_title VARCHAR(255),
    lead_score INTEGER DEFAULT 0,
    lifecycle_stage VARCHAR(50) DEFAULT 'lead',
    source VARCHAR(100),
    tags TEXT[],
    custom_attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE
);

-- Communication Channels
CREATE TABLE IF NOT EXISTS communication_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, push, phone, social
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Templates
CREATE TABLE IF NOT EXISTS campaign_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, push
    subject VARCHAR(500),
    content TEXT,
    variables JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Touchpoints
CREATE TABLE IF NOT EXISTS journey_touchpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    campaign_id UUID REFERENCES campaigns(id),
    touchpoint_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    message_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'sent',
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL,
    conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Test Results
CREATE TABLE IF NOT EXISTS ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    variant_name VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    sample_size INTEGER,
    confidence_level DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Management
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Inbox Messages
CREATE TABLE IF NOT EXISTS inbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    channel VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(50) DEFAULT 'unread',
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'normal',
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle_stage ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_journey_touchpoints_contact_id ON journey_touchpoints(contact_id);
CREATE INDEX IF NOT EXISTS idx_journey_touchpoints_campaign_id ON journey_touchpoints(campaign_id);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_contact_id ON inbox_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_status ON inbox_messages(status);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_assigned_to ON inbox_messages(assigned_to);
