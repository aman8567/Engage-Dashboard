-- Function to update user's last seen and session count
CREATE OR REPLACE FUNCTION update_user_activity(
    p_user_id UUID,
    p_session_id VARCHAR(255) DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET 
        last_seen = NOW(),
        session_count = session_count + CASE WHEN p_session_id IS NOT NULL THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate RFM scores
CREATE OR REPLACE FUNCTION calculate_rfm_scores() RETURNS VOID AS $$
DECLARE
    r_quartiles DECIMAL[];
    f_quartiles DECIMAL[];
    m_quartiles DECIMAL[];
BEGIN
    -- Calculate quartiles for Recency (days since last purchase)
    SELECT ARRAY[
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (NOW() - last_purchase_date))/86400),
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (NOW() - last_purchase_date))/86400),
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (NOW() - last_purchase_date))/86400)
    ] INTO r_quartiles
    FROM users WHERE last_purchase_date IS NOT NULL;

    -- Calculate quartiles for Frequency (total orders)
    SELECT ARRAY[
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_orders),
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_orders),
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_orders)
    ] INTO f_quartiles
    FROM users WHERE total_orders > 0;

    -- Calculate quartiles for Monetary (total spent)
    SELECT ARRAY[
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_spent),
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_spent),
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_spent)
    ] INTO m_quartiles
    FROM users WHERE total_spent > 0;

    -- Update RFM scores
    UPDATE users SET
        rfm_recency = CASE 
            WHEN last_purchase_date IS NULL THEN 1
            WHEN EXTRACT(EPOCH FROM (NOW() - last_purchase_date))/86400 <= r_quartiles[1] THEN 4
            WHEN EXTRACT(EPOCH FROM (NOW() - last_purchase_date))/86400 <= r_quartiles[2] THEN 3
            WHEN EXTRACT(EPOCH FROM (NOW() - last_purchase_date))/86400 <= r_quartiles[3] THEN 2
            ELSE 1
        END,
        rfm_frequency = CASE 
            WHEN total_orders = 0 THEN 1
            WHEN total_orders >= f_quartiles[3] THEN 4
            WHEN total_orders >= f_quartiles[2] THEN 3
            WHEN total_orders >= f_quartiles[1] THEN 2
            ELSE 1
        END,
        rfm_monetary = CASE 
            WHEN total_spent = 0 THEN 1
            WHEN total_spent >= m_quartiles[3] THEN 4
            WHEN total_spent >= m_quartiles[2] THEN 3
            WHEN total_spent >= m_quartiles[1] THEN 2
            ELSE 1
        END;

    -- Update RFM combined score
    UPDATE users SET
        rfm_score = CONCAT(rfm_recency, rfm_frequency, rfm_monetary);
END;
$$ LANGUAGE plpgsql;

-- Function to get segment user count
CREATE OR REPLACE FUNCTION get_segment_user_count(p_segment_id UUID) RETURNS INTEGER AS $$
DECLARE
    segment_criteria JSONB;
    user_count INTEGER;
BEGIN
    SELECT criteria INTO segment_criteria FROM segments WHERE id = p_segment_id;
    
    -- This is a simplified version - in practice, you'd need to parse the criteria
    -- and build dynamic queries based on the segment conditions
    SELECT COUNT(*) INTO user_count FROM users WHERE true; -- Placeholder
    
    RETURN user_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update segment user counts
CREATE OR REPLACE FUNCTION update_segment_counts() RETURNS TRIGGER AS $$
BEGIN
    -- Update all dynamic segments (simplified)
    UPDATE segments SET 
        user_count = get_segment_user_count(id),
        updated_at = NOW()
    WHERE type = 'dynamic';
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_segment_counts
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_segment_counts();
