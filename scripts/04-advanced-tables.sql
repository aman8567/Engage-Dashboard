-- Create advanced tables for MoEngage clone

-- Communication Channels
CREATE TABLE IF NOT EXISTS communication_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(100),
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  html_content TEXT,
  design_config JSONB DEFAULT '{}',
  variables JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'active',
  is_default BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts (Enhanced Users)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  job_title VARCHAR(100),
  lead_source VARCHAR(100),
  lead_status VARCHAR(50) DEFAULT 'new',
  contact_type VARCHAR(50) DEFAULT 'lead',
  lifecycle_stage VARCHAR(50) DEFAULT 'subscriber',
  street_address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  linkedin_url VARCHAR(255),
  twitter_handle VARCHAR(100),
  facebook_url VARCHAR(255),
  instagram_handle VARCHAR(100),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  annual_revenue NUMERIC,
  last_contacted TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  health_score INTEGER DEFAULT 0,
  nps_score INTEGER,
  csat_score INTEGER,
  latitude NUMERIC,
  longitude NUMERIC,
  timezone VARCHAR(50),
  communication_preferences JSONB DEFAULT '{}',
  consent_data JSONB DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_by UUID REFERENCES team_members(id),
  assigned_to UUID REFERENCES team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT contacts_email_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Advanced Campaigns
CREATE TABLE IF NOT EXISTS advanced_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  channel_id UUID REFERENCES communication_channels(id),
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  send_immediately BOOLEAN DEFAULT false,
  segment_id UUID REFERENCES segments(id),
  target_audience JSONB DEFAULT '{}',
  subject VARCHAR(255),
  content TEXT,
  template_id UUID REFERENCES templates(id),
  personalization_data JSONB DEFAULT '{}',
  is_journey BOOLEAN DEFAULT false,
  journey_config JSONB DEFAULT '{}',
  is_ab_test BOOLEAN DEFAULT false,
  ab_test_config JSONB DEFAULT '{}',
  trigger_type VARCHAR(50),
  trigger_config JSONB DEFAULT '{}',
  frequency_cap INTEGER,
  frequency_period VARCHAR(20),
  goal_type VARCHAR(50),
  goal_value NUMERIC DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Steps
CREATE TABLE IF NOT EXISTS journey_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES advanced_campaigns(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  description TEXT,
  config JSONB DEFAULT '{}',
  conditions JSONB DEFAULT '{}',
  delay_amount INTEGER DEFAULT 0,
  delay_unit VARCHAR(20) DEFAULT 'minutes',
  parent_step_id UUID REFERENCES journey_steps(id),
  branch_condition JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inbox Messages
CREATE TABLE IF NOT EXISTS inbox_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  channel_type VARCHAR(50) NOT NULL,
  direction VARCHAR(20) NOT NULL,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  status VARCHAR(50) DEFAULT 'unread',
  priority VARCHAR(20) DEFAULT 'normal',
  thread_id UUID REFERENCES inbox_messages(id),
  parent_message_id UUID REFERENCES inbox_messages(id),
  attachments JSONB DEFAULT '[]',
  external_id VARCHAR(255),
  raw_data JSONB DEFAULT '{}',
  assigned_to UUID REFERENCES team_members(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Touchpoints
CREATE TABLE IF NOT EXISTS journey_touchpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  touchpoint_type VARCHAR(50) NOT NULL,
  channel VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  url VARCHAR(255),
  campaign_id UUID REFERENCES advanced_campaigns(id),
  page_url VARCHAR(255),
  referrer VARCHAR(255),
  engagement_score INTEGER DEFAULT 0,
  duration INTEGER,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  properties JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Sends
CREATE TABLE IF NOT EXISTS campaign_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES advanced_campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  channel_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value NUMERIC DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_status ON contacts(lead_status);
CREATE INDEX IF NOT EXISTS idx_contacts_lifecycle_stage ON contacts(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

CREATE INDEX IF NOT EXISTS idx_advanced_campaigns_status ON advanced_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_advanced_campaigns_type ON advanced_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_advanced_campaigns_segment_id ON advanced_campaigns(segment_id);

CREATE INDEX IF NOT EXISTS idx_inbox_messages_contact_id ON inbox_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_status ON inbox_messages(status);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_assigned_to ON inbox_messages(assigned_to);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_thread_id ON inbox_messages(thread_id);

CREATE INDEX IF NOT EXISTS idx_journey_touchpoints_contact_id ON journey_touchpoints(contact_id);
CREATE INDEX IF NOT EXISTS idx_journey_touchpoints_campaign_id ON journey_touchpoints(campaign_id);
CREATE INDEX IF NOT EXISTS idx_journey_touchpoints_touchpoint_type ON journey_touchpoints(touchpoint_type);

CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign_id ON campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_contact_id ON campaign_sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_status ON campaign_sends(status);
