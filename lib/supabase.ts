import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  external_id: string
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  device_type?: string
  device_model?: string
  os_version?: string
  app_version?: string
  language?: string
  timezone?: string
  country?: string
  city?: string
  latitude?: number
  longitude?: number
  signup_date?: string
  first_session?: string
  last_seen?: string
  session_count: number
  total_time_spent: number
  push_enabled: boolean
  email_subscribed: boolean
  sms_subscribed: boolean
  total_orders: number
  total_spent: number
  avg_order_value: number
  last_purchase_date?: string
  rfm_recency?: number
  rfm_frequency?: number
  rfm_monetary?: number
  rfm_score?: string
  custom_attributes: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  user_id: string
  event_name: string
  event_properties: Record<string, any>
  session_id?: string
  device_type?: string
  device_model?: string
  os_version?: string
  app_version?: string
  country?: string
  city?: string
  latitude?: number
  longitude?: number
  page_url?: string
  referrer?: string
  user_agent?: string
  timestamp: string
  created_at: string
}

export interface Segment {
  id: string
  name: string
  description?: string
  type: "dynamic" | "static"
  criteria: Record<string, any>
  user_count: number
  status: "active" | "inactive" | "draft"
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  name: string
  description?: string
  type: "email" | "push" | "sms" | "in_app" | "whatsapp"
  status: "draft" | "active" | "paused" | "completed" | "scheduled"
  segment_id?: string
  subject?: string
  content?: string
  template_data: Record<string, any>
  scheduled_at?: string
  send_immediately: boolean
  is_ab_test: boolean
  ab_test_percentage: number
  control_group_percentage: number
  frequency_cap?: number
  frequency_period?: string
  is_journey: boolean
  journey_config: Record<string, any>
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_converted: number
  total_revenue: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_id: string
  start_time: string
  end_time?: string
  duration?: number
  device_type?: string
  device_model?: string
  os_version?: string
  app_version?: string
  country?: string
  city?: string
  landing_page?: string
  exit_page?: string
  page_views: number
  events_count: number
  created_at: string
}

export interface SystemLog {
  id: string
  level: "info" | "warning" | "error" | "critical"
  service: string
  message: string
  metadata: Record<string, any>
  timestamp: string
}
