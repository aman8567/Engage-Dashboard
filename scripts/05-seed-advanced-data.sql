-- Seed data for advanced MoEngage clone

-- Insert Communication Channels
INSERT INTO communication_channels (name, type, provider, configuration) VALUES
('Primary Email', 'email', 'sendgrid', '{"api_key": "sg_key", "from_email": "noreply@company.com"}'),
('SMS Gateway', 'sms', 'twilio', '{"account_sid": "twilio_sid", "auth_token": "twilio_token"}'),
('WhatsApp Business', 'whatsapp', 'twilio', '{"phone_number": "+1234567890"}'),
('Push Notifications', 'push', 'firebase', '{"server_key": "firebase_key"}'),
('Phone System', 'phone', 'twilio', '{"phone_number": "+1234567890"}');

-- Insert Templates
INSERT INTO templates (name, type, category, subject, content, variables) VALUES
('Welcome Email', 'email', 'onboarding', 'Welcome to {{company_name}}!', 
 'Hi {{first_name}},\n\nWelcome to {{company_name}}! We''re excited to have you on board.\n\nBest regards,\nThe Team',
 '{"first_name": "string", "company_name": "string"}'),
('Cart Abandonment', 'email', 'ecommerce', 'You left something in your cart!',
 'Hi {{first_name}},\n\nDon''t forget about the items in your cart! Complete your purchase now and get 10% off.\n\nShop now: {{cart_url}}',
 '{"first_name": "string", "cart_url": "string"}'),
('SMS Welcome', 'sms', 'onboarding', '',
 'Welcome to {{company_name}}, {{first_name}}! Thanks for signing up. Reply STOP to opt out.',
 '{"first_name": "string", "company_name": "string"}'),
('Push Welcome', 'push', 'onboarding', 'Welcome aboard!',
 'Thanks for downloading our app, {{first_name}}! Tap to get started.',
 '{"first_name": "string"}');

-- Insert Sample Contacts
INSERT INTO contacts (email, phone, first_name, last_name, company, job_title, lead_score, lifecycle_stage, lead_source, tags, custom_attributes) VALUES
('john.doe@example.com', '+1234567890', 'John', 'Doe', 'Acme Corp', 'Marketing Manager', 85, 'prospect', 'website', ARRAY['enterprise', 'marketing'], '{"industry": "technology", "company_size": "500+"}'),
('jane.smith@example.com', '+1234567891', 'Jane', 'Smith', 'Tech Startup', 'CEO', 92, 'customer', 'referral', ARRAY['startup', 'saas'], '{"industry": "software", "company_size": "10-50"}'),
('bob.wilson@example.com', '+1234567892', 'Bob', 'Wilson', 'Enterprise Inc', 'CTO', 78, 'lead', 'linkedin', ARRAY['enterprise', 'technical'], '{"industry": "finance", "company_size": "1000+"}'),
('alice.brown@example.com', '+1234567893', 'Alice', 'Brown', 'Small Business', 'Owner', 65, 'prospect', 'google_ads', ARRAY['small_business'], '{"industry": "retail", "company_size": "1-10"}');

-- Insert Team Members
INSERT INTO team_members (email, first_name, last_name, role, permissions) VALUES
('admin@company.com', 'Admin', 'User', 'admin', '{"campaigns": "full", "contacts": "full", "analytics": "full", "settings": "full"}'),
('manager@company.com', 'Marketing', 'Manager', 'manager', '{"campaigns": "full", "contacts": "full", "analytics": "read"}'),
('member@company.com', 'Team', 'Member', 'member', '{"campaigns": "limited", "contacts": "read"}');

-- Insert Sample Advanced Campaigns
INSERT INTO advanced_campaigns (name, description, type, status, subject, content, goal_type, total_sent, total_delivered, total_opened, total_clicked, total_converted, total_revenue) VALUES
('Welcome Email Series', 'Automated welcome email for new signups', 'email', 'active', 'Welcome to our platform!', 'Welcome to our amazing platform! Get started today.', 'engagement', 1250, 1200, 480, 120, 45, 2250.00),
('Cart Abandonment SMS', 'SMS reminder for abandoned carts', 'sms', 'active', '', 'Complete your purchase and save 10%! Use code SAVE10', 'conversions', 850, 820, 0, 85, 32, 1600.00),
('Product Launch Push', 'Push notification for new product launch', 'push', 'completed', 'New Product Available!', 'Check out our latest product - now available in the app!', 'awareness', 5000, 4800, 2400, 360, 85, 4250.00),
('Customer Feedback Journey', 'Multi-step feedback collection journey', 'journey', 'active', '', '', 'engagement', 2000, 1950, 780, 156, 89, 0.00),
('Holiday Promotion', 'WhatsApp holiday promotion campaign', 'whatsapp', 'scheduled', '', 'Special holiday offer just for you! 25% off everything. Shop now!', 'revenue', 0, 0, 0, 0, 0, 0.00);

-- Insert Sample Inbox Messages
INSERT INTO inbox_messages (contact_id, channel_type, direction, subject, content, status, priority, metadata) VALUES
((SELECT id FROM contacts WHERE email = 'john.doe@example.com'), 'email', 'inbound', 'Question about pricing', 'Hi, I have a question about your enterprise pricing plans. Can someone help?', 'unread', 'high', '{"source": "contact_form"}'),
((SELECT id FROM contacts WHERE email = 'jane.smith@example.com'), 'sms', 'inbound', '', 'Thanks for the welcome message! Looking forward to using your platform.', 'read', 'normal', '{"phone": "+1234567891"}'),
((SELECT id FROM contacts WHERE email = 'bob.wilson@example.com'), 'whatsapp', 'inbound', '', 'Can you send me more information about your API integration?', 'unread', 'normal', '{"whatsapp_id": "bob_wilson_wa"}'),
((SELECT id FROM contacts WHERE email = 'alice.brown@example.com'), 'email', 'outbound', 'Follow up on demo', 'Hi Alice, thanks for attending our demo yesterday. Do you have any questions?', 'read', 'normal', '{"campaign_id": "demo_followup"});

-- Insert Automation Rules
INSERT INTO automation_rules (name, description, trigger_event, trigger_conditions, actions) VALUES
('Welcome Email Automation', 'Send welcome email to new signups', 'user_signup', '{"source": "website"}', '[{"type": "send_email", "template_id": "welcome_email", "delay": 0}]'),
('Cart Abandonment Flow', 'Send reminder for abandoned carts', 'cart_abandon', '{"cart_value": {"min": 50}}', '[{"type": "send_email", "template_id": "cart_abandon", "delay": 3600}, {"type": "send_sms", "template_id": "cart_sms", "delay": 86400}]'),
('Lead Scoring Update', 'Update lead score based on activity', 'page_view', '{"page": "/pricing"}', '[{"type": "update_score", "points": 10}]');

-- Insert Sample Journey Touchpoints
INSERT INTO journey_touchpoints (journey_id, user_id, step_id, step_type, status, executed_at, data) VALUES
((SELECT id FROM advanced_campaigns WHERE name = 'Customer Feedback Journey'), (SELECT id FROM users LIMIT 1), 'step_1', 'email', 'completed', NOW() - INTERVAL '2 days', '{"template": "feedback_request"}'),
((SELECT id FROM advanced_campaigns WHERE name = 'Customer Feedback Journey'), (SELECT id FROM users LIMIT 1), 'step_2', 'wait', 'completed', NOW() - INTERVAL '1 day', '{"duration": 86400}'),
((SELECT id FROM advanced_campaigns WHERE name = 'Customer Feedback Journey'), (SELECT id FROM users LIMIT 1), 'step_3', 'sms', 'pending', NULL, '{"template": "feedback_reminder"}');

-- Insert A/B Test Results
INSERT INTO ab_test_results (campaign_id, variant, user_id, action, value) VALUES
((SELECT id FROM advanced_campaigns WHERE name = 'Welcome Email Series'), 'A', (SELECT id FROM users LIMIT 1), 'sent', 0),
((SELECT id FROM advanced_campaigns WHERE name = 'Welcome Email Series'), 'A', (SELECT id FROM users LIMIT 1), 'opened', 0),
((SELECT id FROM advanced_campaigns WHERE name = 'Welcome Email Series'), 'B', (SELECT id FROM users OFFSET 1 LIMIT 1), 'sent', 0),
((SELECT id FROM advanced_campaigns WHERE name = 'Welcome Email Series'), 'B', (SELECT id FROM users OFFSET 1 LIMIT 1), 'clicked', 25.00);
