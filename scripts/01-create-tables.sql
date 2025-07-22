-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with comprehensive attributes
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    
    -- Standard MoEngage attributes
    device_type VARCHAR(50),
    device_model VARCHAR(100),
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    language VARCHAR(10),
    timezone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- User lifecycle
    signup_date TIMESTAMP WITH TIME ZONE,
    first_session TIMESTAMP WITH TIME ZONE,
    last_seen TIMESTAMP WITH TIME ZONE,
    session_count INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    
    -- Engagement metrics
    push_enabled BOOLEAN DEFAULT false,
    email_subscribed BOOLEAN DEFAULT true,
    sms_subscribed BOOLEAN DEFAULT false,
    
    -- Business metrics
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    avg_order_value DECIMAL(10, 2) DEFAULT 0,
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    
    -- RFM Segmentation
    rfm_recency INTEGER,
    rfm_frequency INTEGER,
    rfm_monetary INTEGER,
    rfm_score VARCHAR(10),
    
    -- Custom attributes (JSONB for flexibility)
    custom_attributes JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User attributes table for dynamic custom attributes
CREATE TABLE user_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    attribute_name VARCHAR(255) NOT NULL,
    attribute_value TEXT,
    attribute_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, date
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, attribute_name)
);

-- Events table for tracking user activities
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(255) NOT NULL,
    event_properties JSONB DEFAULT '{}',
    
    -- Session info
    session_id VARCHAR(255),
    
    -- Device/Context info
    device_type VARCHAR(50),
    device_model VARCHAR(100),
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    
    -- Location info
    country VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Web specific
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    
    -- Timestamp
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Segments table
CREATE TABLE segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'dynamic', -- dynamic, static
    criteria JSONB NOT NULL,
    user_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, draft
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Segment users mapping (for static segments)
CREATE TABLE segment_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    segment_id UUID REFERENCES segments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(segment_id, user_id)
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- email, push, sms, in_app, whatsapp
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused, completed, scheduled
    
    -- Targeting
    segment_id UUID REFERENCES segments(id),
    
    -- Campaign content
    subject VARCHAR(500),
    content TEXT,
    template_data JSONB DEFAULT '{}',
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE,
    send_immediately BOOLEAN DEFAULT false,
    
    -- A/B Testing
    is_ab_test BOOLEAN DEFAULT false,
    ab_test_percentage INTEGER DEFAULT 50,
    control_group_percentage INTEGER DEFAULT 10,
    
    -- Campaign settings
    frequency_cap INTEGER,
    frequency_period VARCHAR(20), -- hour, day, week, month
    
    -- Journey/Flow settings
    is_journey BOOLEAN DEFAULT false,
    journey_config JSONB DEFAULT '{}',
    
    -- Metrics
    total_sent INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    
    -- Metadata
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign sends table (individual message sends)
CREATE TABLE campaign_sends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Send details
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, bounced, failed, opened, clicked, converted
    
    -- A/B Test info
    variant VARCHAR(10), -- A, B, control
    
    -- Message content (for personalization tracking)
    message_content TEXT,
    
    -- Error info
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Session details
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in seconds
    
    -- Device/Context
    device_type VARCHAR(50),
    device_model VARCHAR(100),
    os_version VARCHAR(50),
    app_version VARCHAR(50),
    
    -- Location
    country VARCHAR(100),
    city VARCHAR(100),
    
    -- Web specific
    landing_page TEXT,
    exit_page TEXT,
    page_views INTEGER DEFAULT 0,
    
    -- Engagement
    events_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funnels table for funnel analysis
CREATE TABLE funnels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- Array of step definitions
    date_range_start TIMESTAMP WITH TIME ZONE,
    date_range_end TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cohorts table for cohort analysis
CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cohort_date DATE NOT NULL,
    user_count INTEGER DEFAULT 0,
    retention_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System monitoring tables
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL, -- info, warning, error, critical
    service VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time INTEGER, -- in milliseconds
    user_agent TEXT,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_external_id ON users(external_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_seen ON users(last_seen);
CREATE INDEX idx_users_signup_date ON users(signup_date);
CREATE INDEX idx_users_country ON users(country);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_event_name ON events(event_name);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_session_id ON events(session_id);

CREATE INDEX idx_user_attributes_user_id ON user_attributes(user_id);
CREATE INDEX idx_user_attributes_name ON user_attributes(attribute_name);

CREATE INDEX idx_campaign_sends_campaign_id ON campaign_sends(campaign_id);
CREATE INDEX idx_campaign_sends_user_id ON campaign_sends(user_id);
CREATE INDEX idx_campaign_sends_status ON campaign_sends(status);
CREATE INDEX idx_campaign_sends_sent_at ON campaign_sends(sent_at);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_start_time ON user_sessions(start_time);

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);
