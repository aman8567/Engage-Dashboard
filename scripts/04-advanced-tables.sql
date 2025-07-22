-- Advanced tables for comprehensive MoEngage clone

-- Communication Channels Configuration
CREATE TABLE communication_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, push, phone, social
    provider VARCHAR(100) NOT NULL, -- sendgrid, twilio, etc.
    configuration JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced Campaigns Table
CREATE TABLE advanced_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, push, phone, journey
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed, scheduled
    channel_id UUID REFERENCES communication_channels(id),
    segment_id UUID REFERENCES segments(id),
    template_id UUID,
    subject VARCHAR(500),
    content TEXT,
    trigger_type VARCHAR(50) DEFAULT 'manual', -- manual, scheduled, event, behavior, api
    trigger_config JSONB DEFAULT '{}',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    is_journey BOOLEAN DEFAULT false,
    journey_config JSONB DEFAULT '{}',
    is_ab_test BOOLEAN DEFAULT false,
    ab_test_config JSONB DEFAULT '{}',
    goal_type VARCHAR(50) DEFAULT 'engagement',
    goal_value DECIMAL(10,2) DEFAULT 0,
    frequency_cap INTEGER DEFAULT 1,
    frequency_period VARCHAR(20) DEFAULT 'day',
    target_audience JSONB DEFAULT '{}',
    personalization_data JSONB DEFAULT '{}',
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Templates
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, push
    category VARCHAR(100),
    subject VARCHAR(500),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    preview_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced Contacts/Leads Management
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    job_title VARCHAR(255),
    lead_score INTEGER DEFAULT 0,
    lifecycle_stage VARCHAR(50) DEFAULT 'lead', -- lead, prospect, customer, evangelist
    lead_source VARCHAR(100),
    tags TEXT[],
    custom_attributes JSONB DEFAULT '{}',
    last_activity_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Touchpoints
CREATE TABLE journey_touchpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID REFERENCES advanced_campaigns(id),
    user_id UUID REFERENCES users(id),
    step_id VARCHAR(100) NOT NULL,
    step_type VARCHAR(50) NOT NULL, -- email, sms, wait, condition, webhook
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, skipped
    executed_at TIMESTAMP WITH TIME ZONE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL, -- user_signup, purchase, cart_abandon, etc.
    trigger_conditions JSONB DEFAULT '{}',
    actions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Test Results
CREATE TABLE ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES advanced_campaigns(id),
    variant VARCHAR(10) NOT NULL, -- A, B
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- sent, opened, clicked, converted
    value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Management
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'member', -- admin, manager, member, viewer
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unified Inbox Messages
CREATE TABLE inbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    channel_type VARCHAR(50) NOT NULL, -- email, sms, whatsapp, phone, social
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    subject VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied, archived
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    assigned_to UUID REFERENCES team_members(id),
    thread_id UUID,
    external_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_advanced_campaigns_status ON advanced_campaigns(status);
CREATE INDEX idx_advanced_campaigns_type ON advanced_campaigns(type);
CREATE INDEX idx_advanced_campaigns_scheduled_at ON advanced_campaigns(scheduled_at);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_lead_score ON contacts(lead_score);
CREATE INDEX idx_inbox_messages_status ON inbox_messages(status);
CREATE INDEX idx_inbox_messages_assigned_to ON inbox_messages(assigned_to);
CREATE INDEX idx_journey_touchpoints_journey_user ON journey_touchpoints(journey_id, user_id);
