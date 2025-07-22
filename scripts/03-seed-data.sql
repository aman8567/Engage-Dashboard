-- Insert sample users
INSERT INTO users (
    external_id, email, first_name, last_name, device_type, device_model, 
    os_version, app_version, country, city, signup_date, last_seen,
    total_orders, total_spent, push_enabled, email_subscribed,
    custom_attributes
) VALUES 
('user_001', 'john.doe@example.com', 'John', 'Doe', 'iOS', 'iPhone 15', '17.1', '2.1.0', 'United States', 'New York', '2024-01-01', NOW() - INTERVAL '2 hours', 5, 299.99, true, true, '{"subscription_tier": "premium", "favorite_category": "electronics"}'),
('user_002', 'jane.smith@example.com', 'Jane', 'Smith', 'Android', 'Samsung Galaxy S24', '14.0', '2.1.0', 'United Kingdom', 'London', '2024-01-02', NOW() - INTERVAL '1 day', 2, 149.99, false, true, '{"subscription_tier": "basic", "favorite_category": "books"}'),
('user_003', 'bob.wilson@example.com', 'Bob', 'Wilson', 'Web', 'Chrome Desktop', 'Windows 11', '2.1.0', 'Canada', 'Toronto', '2024-01-03', NOW() - INTERVAL '30 minutes', 8, 599.99, true, true, '{"subscription_tier": "premium", "favorite_category": "sports"}'),
('user_004', 'alice.brown@example.com', 'Alice', 'Brown', 'iOS', 'iPhone 14', '16.7', '2.0.9', 'Australia', 'Sydney', '2024-01-04', NOW() - INTERVAL '3 days', 1, 49.99, true, false, '{"subscription_tier": "basic", "favorite_category": "fashion"}'),
('user_005', 'charlie.davis@example.com', 'Charlie', 'Davis', 'Android', 'Google Pixel 8', '14.0', '2.1.0', 'Germany', 'Berlin', '2024-01-05', NOW() - INTERVAL '1 hour', 12, 899.99, true, true, '{"subscription_tier": "enterprise", "favorite_category": "technology"}');

-- Insert sample events
INSERT INTO events (user_id, event_name, event_properties, session_id, device_type, country, city, timestamp) 
SELECT 
    u.id,
    event_names.name,
    event_properties.props,
    'session_' || u.external_id || '_' || generate_random_uuid(),
    u.device_type,
    u.country,
    u.city,
    NOW() - (random() * INTERVAL '30 days')
FROM users u
CROSS JOIN (
    VALUES 
    ('page_view', '{"page": "/home", "duration": 45}'),
    ('button_click', '{"button": "add_to_cart", "product_id": "prod_123"}'),
    ('purchase_completed', '{"amount": 99.99, "currency": "USD", "product_id": "prod_123"}'),
    ('form_submit', '{"form_name": "newsletter", "email": "user@example.com"}'),
    ('video_watched', '{"video_id": "vid_456", "duration": 120, "completion_rate": 0.8}'),
    ('search_performed', '{"query": "smartphone", "results_count": 25}'),
    ('cart_abandoned', '{"cart_value": 199.99, "items_count": 3}'),
    ('app_opened', '{"source": "push_notification"}'),
    ('profile_updated', '{"fields_changed": ["email", "phone"]}'),
    ('logout', '{"session_duration": 1800}')
) AS event_names(name, props)
CROSS JOIN (
    SELECT props::jsonb FROM (VALUES ('{}')) AS event_properties(props)
) AS event_properties
WHERE random() < 0.3; -- 30% chance for each user-event combination

-- Insert sample segments
INSERT INTO segments (name, description, type, criteria, status) VALUES
('High Value Customers', 'Users who have spent more than $500', 'dynamic', 
 '{"conditions": [{"field": "total_spent", "operator": "greater_than", "value": 500}]}', 'active'),
('Cart Abandoners', 'Users who abandoned their cart in the last 7 days', 'dynamic',
 '{"conditions": [{"field": "events", "operator": "contains", "value": "cart_abandoned", "timeframe": "7_days"}]}', 'active'),
('Mobile Users', 'Users who primarily use mobile devices', 'dynamic',
 '{"conditions": [{"field": "device_type", "operator": "in", "value": ["iOS", "Android"]}]}', 'active'),
('Premium Subscribers', 'Users with premium subscription', 'dynamic',
 '{"conditions": [{"field": "custom_attributes.subscription_tier", "operator": "equals", "value": "premium"}]}', 'active');

-- Insert sample campaigns
INSERT INTO campaigns (name, description, type, status, segment_id, subject, content, total_sent, total_delivered, total_opened, total_clicked, total_converted) 
SELECT 
    'Welcome Series - ' || s.name,
    'Welcome new users from ' || s.name || ' segment',
    'email',
    'completed',
    s.id,
    'Welcome to our platform!',
    'Thank you for joining us. Here''s what you can do next...',
    1000 + (random() * 5000)::int,
    950 + (random() * 4500)::int,
    400 + (random() * 2000)::int,
    100 + (random() * 500)::int,
    20 + (random() * 100)::int
FROM segments s;

-- Calculate initial RFM scores
SELECT calculate_rfm_scores();

-- Insert system logs
INSERT INTO system_logs (level, service, message, metadata) VALUES
('info', 'campaign_service', 'Campaign "Welcome Series" sent successfully', '{"campaign_id": "123", "recipients": 1500}'),
('warning', 'email_service', 'High bounce rate detected', '{"bounce_rate": 0.15, "threshold": 0.1}'),
('error', 'push_service', 'Failed to send push notification', '{"error": "Invalid device token", "user_id": "user_001"}'),
('info', 'segment_service', 'Segment "High Value Customers" updated', '{"user_count": 2341, "previous_count": 2298}');
