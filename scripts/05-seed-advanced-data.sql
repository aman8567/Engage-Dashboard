-- Seed data for MoEngage clone advanced tables

-- Insert team members
INSERT INTO team_members (id, first_name, last_name, email, role, permissions, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'John', 'Doe', 'john@example.com', 'admin', '{"all": true}', true),
  ('22222222-2222-2222-2222-222222222222', 'Jane', 'Smith', 'jane@example.com', 'marketer', '{"campaigns": true, "segments": true}', true),
  ('33333333-3333-3333-3333-333333333333', 'Mike', 'Johnson', 'mike@example.com', 'support', '{"inbox": true}', true),
  ('44444444-4444-4444-4444-444444444444', 'Sarah', 'Williams', 'sarah@example.com', 'analyst', '{"analytics": true}', true);

-- Insert communication channels
INSERT INTO communication_channels (id, name, type, provider, configuration, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Transactional Email', 'email', 'SendGrid', '{"api_key": "SAMPLE_KEY", "from_email": "no-reply@example.com"}', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Marketing Email', 'email', 'Mailchimp', '{"api_key": "SAMPLE_KEY", "list_id": "main_list"}', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'SMS Notifications', 'sms', 'Twilio', '{"account_sid": "SAMPLE_SID", "auth_token": "SAMPLE_TOKEN"}', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'WhatsApp Business', 'whatsapp', 'Twilio', '{"account_sid": "SAMPLE_SID", "auth_token": "SAMPLE_TOKEN"}', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Mobile Push', 'push', 'Firebase', '{"server_key": "SAMPLE_KEY"}', true);

-- Insert templates
INSERT INTO templates (id, name, description, type, category, subject, content, html_content, variables, status, is_default)
VALUES
  ('11111111-aaaa-bbbb-cccc-dddddddddddd', 'Welcome Email', 'Sent to new users', 'email', 'onboarding', 'Welcome to Our Platform!', 'Hi {{first_name}}, Welcome to our platform! We''re excited to have you on board.', '<h1>Welcome to Our Platform!</h1><p>Hi {{first_name}},</p><p>We''re excited to have you on board.</p>', '["first_name"]', 'active', true),
  ('22222222-aaaa-bbbb-cccc-dddddddddddd', 'Password Reset', 'Password reset email', 'email', 'transactional', 'Reset Your Password', 'Hi {{first_name}}, Click the link to reset your password: {{reset_link}}', '<h1>Reset Your Password</h1><p>Hi {{first_name}},</p><p>Click the link to reset your password: {{reset_link}}</p>', '["first_name", "reset_link"]', 'active', true),
  ('33333333-aaaa-bbbb-cccc-dddddddddddd', 'Order Confirmation', 'Order confirmation email', 'email', 'transactional', 'Your Order #{{order_id}} is Confirmed', 'Hi {{first_name}}, Your order #{{order_id}} has been confirmed. Total: ${{amount}}', '<h1>Order Confirmed</h1><p>Hi {{first_name}},</p><p>Your order #{{order_id}} has been confirmed.</p><p>Total: ${{amount}}</p>', '["first_name", "order_id", "amount"]', 'active', true),
  ('44444444-aaaa-bbbb-cccc-dddddddddddd', 'Appointment Reminder', 'SMS reminder for appointments', 'sms', 'transactional', null, 'Hi {{first_name}}, reminder: your appointment is scheduled for {{appointment_time}}. Reply Y to confirm.', null, '["first_name", "appointment_time"]', 'active', true),
  ('55555555-aaaa-bbbb-cccc-dddddddddddd', 'Promotional Offer', 'Special offer notification', 'push', 'marketing', 'Special Offer Inside!', 'Hi {{first_name}}, enjoy 20% off your next purchase with code: {{promo_code}}', null, '["first_name", "promo_code"]', 'active', false);

-- Insert contacts
INSERT INTO contacts (id, first_name, last_name, email, phone, company, job_title, lead_status, lifecycle_stage, country, city, industry, health_score, assigned_to, created_at)
VALUES
  ('aaaaaaaa-1111-2222-3333-444444444444', 'Alex', 'Johnson', 'alex@example.com', '+15551234567', 'Acme Inc', 'CTO', 'qualified', 'customer', 'United States', 'New York', 'Technology', 85, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '30 days'),
  ('bbbbbbbb-1111-2222-3333-444444444444', 'Emma', 'Wilson', 'emma@example.com', '+15552345678', 'XYZ Corp', 'Marketing Director', 'new', 'lead', 'United Kingdom', 'London', 'Retail', 45, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 days'),
  ('cccccccc-1111-2222-3333-444444444444', 'Michael', 'Brown', 'michael@example.com', '+15553456789', 'ABC Ltd', 'CEO', 'qualified', 'opportunity', 'Canada', 'Toronto', 'Finance', 75, '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '60 days'),
  ('dddddddd-1111-2222-3333-444444444444', 'Sophia', 'Garcia', 'sophia@example.com', '+15554567890', 'Tech Solutions', 'Developer', 'new', 'subscriber', 'Spain', 'Madrid', 'Technology', 30, '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '5 days'),
  ('eeeeeeee-1111-2222-3333-444444444444', 'James', 'Miller', 'james@example.com', '+15555678901', 'Global Retail', 'Sales Manager', 'qualified', 'customer', 'Australia', 'Sydney', 'Retail', 90, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '45 days');

-- Insert advanced campaigns
INSERT INTO advanced_campaigns (id, name, description, type, channel_id, status, segment_id, subject, content, is_journey, is_ab_test, trigger_type, goal_type, total_sent, total_delivered, total_opened, total_clicked, total_converted, total_revenue, created_by, created_at)
VALUES
  ('campaign-1111-2222-3333-444444444444', 'Welcome Series', 'Onboarding email series for new users', 'email', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'active', '11111111-1111-1111-1111-111111111111', 'Welcome to Our Platform!', 'Hi {{first_name}}, Welcome to our platform!', true, false, 'event', 'engagement', 1250, 1200, 950, 450, 120, 5600, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '30 days'),
  ('campaign-2222-2222-3333-444444444444', 'Flash Sale', 'Limited time promotion', 'email', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'completed', '22222222-2222-2222-2222-222222222222', '24-Hour Flash Sale!', 'Hi {{first_name}}, Don''t miss our 24-hour flash sale!', false, true, 'scheduled', 'revenue', 5000, 4850, 3200, 1800, 450, 22500, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 days'),
  ('campaign-3333-2222-3333-444444444444', 'Appointment Reminder', 'SMS reminder for upcoming appointments', 'sms', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'active', '33333333-3333-3333-3333-333333333333', NULL, 'Hi {{first_name}}, reminder: your appointment is tomorrow at {{time}}.', false, false, 'scheduled', 'conversion', 750, 740, NULL, NULL, 680, 0, '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '7 days'),
  ('campaign-4444-2222-3333-444444444444', 'New Feature Announcement', 'Push notification for new app features', 'push', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'draft', '44444444-4444-4444-4444-444444444444', 'New Features Available!', 'Hi {{first_name}}, check out our latest features!', false, false, 'manual', 'engagement', 0, 0, 0, 0, 0, 0, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days'),
  ('campaign-5555-2222-3333-444444444444', 'Re-engagement Campaign', 'Win back inactive users', 'email', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'scheduled', '55555555-5555-5555-5555-555555555555', 'We Miss You!', 'Hi {{first_name}}, it''s been a while since we''ve seen you.', false, true, 'scheduled', 'engagement', 0, 0, 0, 0, 0, 0, '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '2 days');

-- Insert journey steps for Welcome Series campaign
INSERT INTO journey_steps (id, campaign_id, step_order, step_type, name, description, config, delay_amount, delay_unit)
VALUES
  ('step-1111-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 1, 'email', 'Welcome Email', 'Initial welcome email', '{"template_id": "11111111-aaaa-bbbb-cccc-dddddddddddd"}', 0, 'minutes'),
  ('step-2222-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 2, 'email', 'Getting Started Guide', 'How to get started', '{"subject": "Getting Started Guide", "content": "Here are some tips to get started..."}', 2, 'days'),
  ('step-3333-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 3, 'condition', 'Check Activity', 'Check if user has logged in', '{"condition": "has_logged_in", "value": true}', 5, 'days'),
  ('step-4444-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 4, 'email', 'Feature Highlight', 'Highlight key features', '{"subject": "Discover Our Key Features", "content": "Check out these powerful features..."}', 1, 'days'),
  ('step-5555-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 5, 'email', 'Feedback Request', 'Ask for feedback', '{"subject": "How Are We Doing?", "content": "We''d love to hear your feedback..."}', 7, 'days');

-- Insert inbox messages
INSERT INTO inbox_messages (id, contact_id, channel_type, direction, subject, content, status, priority, assigned_to, received_at)
VALUES
  ('msg-1111-aaaa-bbbb-cccc-dddddddddddd', 'aaaaaaaa-1111-2222-3333-444444444444', 'email', 'inbound', 'Question about subscription', 'Hi, I have a question about my subscription plan. Can you help?', 'unread', 'high', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '2 hours'),
  ('msg-2222-aaaa-bbbb-cccc-dddddddddddd', 'bbbbbbbb-1111-2222-3333-444444444444', 'email', 'inbound', 'Technical issue', 'I''m experiencing a technical issue with the platform. The dashboard isn''t loading correctly.', 'read', 'normal', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day'),
  ('msg-3333-aaaa-bbbb-cccc-dddddddddddd', 'cccccccc-1111-2222-3333-444444444444', 'whatsapp', 'inbound', NULL, 'Is there a way to upgrade my account to the premium plan?', 'unread', 'normal', NULL, NOW() - INTERVAL '4 hours'),
  ('msg-4444-aaaa-bbbb-cccc-dddddddddddd', 'dddddddd-1111-2222-3333-444444444444', 'sms', 'inbound', NULL, 'HELP: I need assistance with my account', 'unread', 'urgent', NULL, NOW() - INTERVAL '30 minutes'),
  ('msg-5555-aaaa-bbbb-cccc-dddddddddddd', 'eeeeeeee-1111-2222-3333-444444444444', 'email', 'inbound', 'Feedback on new features', 'I love the new features you added! The dashboard is much more intuitive now.', 'read', 'low', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '3 days');

-- Insert replies to some messages
INSERT INTO inbox_messages (id, contact_id, channel_type, direction, subject, content, status, priority, assigned_to, thread_id, parent_message_id, sent_at, received_at)
VALUES
  ('msg-2222-reply-bbbb-cccc-dddddddddddd', 'bbbbbbbb-1111-2222-3333-444444444444', 'email', 'outbound', 'Re: Technical issue', 'Hi Emma, I''m sorry to hear about the technical issue. Can you please provide more details about what browser you''re using?', 'sent', 'normal', '33333333-3333-3333-3333-333333333333', 'msg-2222-aaaa-bbbb-cccc-dddddddddddd', 'msg-2222-aaaa-bbbb-cccc-dddddddddddd', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours'),
  ('msg-5555-reply-bbbb-cccc-dddddddddddd', 'eeeeeeee-1111-2222-3333-444444444444', 'email', 'outbound', 'Re: Feedback on new features', 'Hi James, thank you for your positive feedback! We''re glad you''re enjoying the new features. Is there anything else you''d like to see improved?', 'sent', 'low', '33333333-3333-3333-3333-333333333333', 'msg-5555-aaaa-bbbb-cccc-dddddddddddd', 'msg-5555-aaaa-bbbb-cccc-dddddddddddd', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Insert journey touchpoints
INSERT INTO journey_touchpoints (id, contact_id, touchpoint_type, channel, title, campaign_id, engagement_score, device_type, browser, country, timestamp)
VALUES
  ('touch-1111-aaaa-bbbb-cccc-dddddddddddd', 'aaaaaaaa-1111-2222-3333-444444444444', 'email_open', 'email', 'Welcome Email', 'campaign-1111-2222-3333-444444444444', 10, 'mobile', 'Safari', 'United States', NOW() - INTERVAL '29 days'),
  ('touch-2222-aaaa-bbbb-cccc-dddddddddddd', 'aaaaaaaa-1111-2222-3333-444444444444', 'email_click', 'email', 'Welcome Email', 'campaign-1111-2222-3333-444444444444', 30, 'mobile', 'Safari', 'United States', NOW() - INTERVAL '29 days'),
  ('touch-3333-aaaa-bbbb-cccc-dddddddddddd', 'aaaaaaaa-1111-2222-3333-444444444444', 'app_open', 'app', 'Mobile App', NULL, 20, 'mobile', NULL, 'United States', NOW() - INTERVAL '28 days'),
  ('touch-4444-aaaa-bbbb-cccc-dddddddddddd', 'bbbbbbbb-1111-2222-3333-444444444444', 'email_open', 'email', 'Flash Sale', 'campaign-2222-2222-3333-444444444444', 10, 'desktop', 'Chrome', 'United Kingdom', NOW() - INTERVAL '14 days'),
  ('touch-5555-aaaa-bbbb-cccc-dddddddddddd', 'bbbbbbbb-1111-2222-3333-444444444444', 'purchase', 'web', 'Online Store', NULL, 100, 'desktop', 'Chrome', 'United Kingdom', NOW() - INTERVAL '13 days'),
  ('touch-6666-aaaa-bbbb-cccc-dddddddddddd', 'cccccccc-1111-2222-3333-444444444444', 'sms_delivered', 'sms', 'Appointment Reminder', 'campaign-3333-2222-3333-444444444444', 5, 'mobile', NULL, 'Canada', NOW() - INTERVAL '6 days'),
  ('touch-7777-aaaa-bbbb-cccc-dddddddddddd', 'cccccccc-1111-2222-3333-444444444444', 'appointment_confirmed', 'sms', 'Appointment Reminder', 'campaign-3333-2222-3333-444444444444', 50, 'mobile', NULL, 'Canada', NOW() - INTERVAL '6 days');

-- Insert campaign sends
INSERT INTO campaign_sends (id, campaign_id, contact_id, channel_type, status, sent_at, delivered_at, opened_at, clicked_at, converted_at, conversion_value)
VALUES
  ('send-1111-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 'aaaaaaaa-1111-2222-3333-444444444444', 'email', 'delivered', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days', 250),
  ('send-2222-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 'bbbbbbbb-1111-2222-3333-444444444444', 'email', 'delivered', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NULL, NULL, 0),
  ('send-3333-aaaa-bbbb-cccc-dddddddddddd', 'campaign-1111-2222-3333-444444444444', 'cccccccc-1111-2222-3333-444444444444', 'email', 'bounced', NOW() - INTERVAL '30 days', NULL, NULL, NULL, NULL, 0),
  ('send-4444-aaaa-bbbb-cccc-dddddddddddd', 'campaign-2222-2222-3333-444444444444', 'aaaaaaaa-1111-2222-3333-444444444444', 'email', 'delivered', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', 120),
  ('send-5555-aaaa-bbbb-cccc-dddddddddddd', 'campaign-2222-2222-3333-444444444444', 'bbbbbbbb-1111-2222-3333-444444444444', 'email', 'delivered', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days', 350),
  ('send-6666-aaaa-bbbb-cccc-dddddddddddd', 'campaign-3333-2222-3333-444444444444', 'cccccccc-1111-2222-3333-444444444444', 'sms', 'delivered', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NULL, NULL, NOW() - INTERVAL '6 days', 0),
  ('send-7777-aaaa-bbbb-cccc-dddddddddddd', 'campaign-3333-2222-3333-444444444444', 'dddddddd-1111-2222-3333-444444444444', 'sms', 'delivered', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NULL, NULL, NULL, 0);
