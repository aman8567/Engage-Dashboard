-- Insert Communication Channels
INSERT INTO communication_channels (name, type, configuration) VALUES
('Email Service', 'email', '{"provider": "sendgrid", "api_key": "xxx"}'),
('SMS Gateway', 'sms', '{"provider": "twilio", "account_sid": "xxx"}'),
('WhatsApp Business', 'whatsapp', '{"provider": "twilio", "phone_number": "+1234567890"}'),
('Push Notifications', 'push', '{"provider": "firebase", "server_key": "xxx"}'),
('Phone System', 'phone', '{"provider": "twilio", "phone_number": "+1234567890"}'),
('Facebook Messenger', 'social', '{"provider": "facebook", "page_id": "xxx"}');

-- Insert Sample Contacts
INSERT INTO contacts (email, phone, first_name, last_name, company, job_title, lead_score, lifecycle_stage, source) VALUES
('john.doe@example.com', '+1234567890', 'John', 'Doe', 'Acme Corp', 'Marketing Manager', 85, 'customer', 'website'),
('jane.smith@example.com', '+1234567891', 'Jane', 'Smith', 'Tech Solutions', 'CEO', 92, 'customer', 'referral'),
('bob.johnson@example.com', '+1234567892', 'Bob', 'Johnson', 'StartupXYZ', 'CTO', 78, 'lead', 'social_media'),
('alice.brown@example.com', '+1234567893', 'Alice', 'Brown', 'Enterprise Inc', 'VP Sales', 95, 'opportunity', 'webinar'),
('charlie.wilson@example.com', '+1234567894', 'Charlie', 'Wilson', 'Growth Co', 'Product Manager', 67, 'lead', 'content');

-- Insert Campaign Templates
INSERT INTO campaign_templates (name, type, subject, content, variables) VALUES
('Welcome Email', 'email', 'Welcome to {{company_name}}!', 
 '<h1>Welcome {{first_name}}!</h1><p>Thank you for joining {{company_name}}. We''re excited to have you on board.</p>',
 '{"company_name": "MoEngage", "first_name": "User"}'),
('Cart Abandonment SMS', 'sms', '', 
 'Hi {{first_name}}, you left items in your cart. Complete your purchase now and get 10% off!',
 '{"first_name": "Customer"}'),
('Product Launch WhatsApp', 'whatsapp', '', 
 'Exciting news {{first_name}}! Our new product {{product_name}} is now available. Check it out!',
 '{"first_name": "Customer", "product_name": "Product"}'),
('Re-engagement Push', 'push', 'We miss you!', 
 'Come back and see what''s new, {{first_name}}. Special offers waiting for you!',
 '{"first_name": "User"}');

-- Insert Teams
INSERT INTO teams (name, description) VALUES
('Marketing Team', 'Responsible for all marketing campaigns and lead generation'),
('Sales Team', 'Handles lead qualification and customer acquisition'),
('Customer Success', 'Manages customer onboarding and retention'),
('Product Team', 'Develops and maintains product features');

-- Insert Team Members (assuming user IDs exist)
INSERT INTO team_members (team_id, user_id, role) 
SELECT t.id, u.id, 'member'
FROM teams t, users u 
WHERE t.name = 'Marketing Team' AND u.email LIKE '%@%'
LIMIT 3;

-- Insert Automation Rules
INSERT INTO automation_rules (name, trigger_event, conditions, actions, created_by) VALUES
('Welcome Series', 'user_signup', 
 '{"user_type": "new", "source": "website"}',
 '{"send_email": {"template_id": "welcome", "delay": "0"}, "add_to_segment": {"segment_name": "new_users"}}',
 (SELECT id FROM users LIMIT 1)),
('Cart Abandonment', 'cart_abandoned', 
 '{"cart_value": {"min": 50}, "time_since": "1 hour"}',
 '{"send_sms": {"template_id": "cart_abandonment", "delay": "1 hour"}}',
 (SELECT id FROM users LIMIT 1)),
('Re-engagement Campaign', 'user_inactive', 
 '{"last_activity": {"days_ago": 30}}',
 '{"send_push": {"template_id": "re_engagement", "delay": "0"}}',
 (SELECT id FROM users LIMIT 1));

-- Insert Sample Inbox Messages
INSERT INTO inbox_messages (contact_id, channel, direction, subject, content, status, priority) VALUES
((SELECT id FROM contacts WHERE email = 'john.doe@example.com'), 'email', 'inbound', 'Question about pricing', 'Hi, I have a question about your pricing plans. Can you help?', 'unread', 'high'),
((SELECT id FROM contacts WHERE email = 'jane.smith@example.com'), 'whatsapp', 'inbound', '', 'When will the new feature be available?', 'read', 'normal'),
((SELECT id FROM contacts WHERE email = 'bob.johnson@example.com'), 'sms', 'inbound', '', 'Thanks for the demo yesterday!', 'replied', 'low'),
((SELECT id FROM contacts WHERE email = 'alice.brown@example.com'), 'email', 'inbound', 'Integration support needed', 'We need help setting up the API integration.', 'unread', 'high');

-- Insert Journey Touchpoints
INSERT INTO journey_touchpoints (contact_id, campaign_id, touchpoint_type, channel, message_id, status) VALUES
((SELECT id FROM contacts WHERE email = 'john.doe@example.com'), (SELECT id FROM campaigns LIMIT 1), 'email_sent', 'email', 'msg_001', 'delivered'),
((SELECT id FROM contacts WHERE email = 'jane.smith@example.com'), (SELECT id FROM campaigns LIMIT 1), 'sms_sent', 'sms', 'msg_002', 'delivered'),
((SELECT id FROM contacts WHERE email = 'bob.johnson@example.com'), (SELECT id FROM campaigns LIMIT 1), 'push_sent', 'push', 'msg_003', 'opened'),
((SELECT id FROM contacts WHERE email = 'alice.brown@example.com'), (SELECT id FROM campaigns LIMIT 1), 'whatsapp_sent', 'whatsapp', 'msg_004', 'clicked');
