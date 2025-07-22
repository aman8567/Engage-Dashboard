import { supabase } from "./supabase"
import type { Event, Segment, Campaign } from "./supabase"

// Users API
export const usersApi = {
  async getAll(filters?: {
    search?: string
    country?: string
    device_type?: string
    subscription_tier?: string
    rfm_score?: string
    date_range?: { start: string; end: string }
    limit?: number
    offset?: number
  }) {
    let query = supabase.from("users").select("*").order("last_seen", { ascending: false })

    if (filters?.search) {
      query = query.or(
        `email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,external_id.ilike.%${filters.search}%`,
      )
    }

    if (filters?.country) {
      query = query.eq("country", filters.country)
    }

    if (filters?.device_type) {
      query = query.eq("device_type", filters.device_type)
    }

    if (filters?.subscription_tier) {
      query = query.contains("custom_attributes", { subscription_tier: filters.subscription_tier })
    }

    if (filters?.rfm_score) {
      query = query.eq("rfm_score", filters.rfm_score)
    }

    if (filters?.date_range) {
      query = query.gte("signup_date", filters.date_range.start).lte("signup_date", filters.date_range.end)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    return query
  },

  async getById(id: string) {
    return supabase.from("users").select("*").eq("id", id).single()
  },

  async getUserEvents(userId: string, limit = 50) {
    return supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(limit)
  },

  async getUserSessions(userId: string, limit = 20) {
    return supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: false })
      .limit(limit)
  },

  async getUserCampaigns(userId: string) {
    return supabase
      .from("campaign_sends")
      .select(`
        *,
        campaigns (
          id,
          name,
          type,
          subject
        )
      `)
      .eq("user_id", userId)
      .order("sent_at", { ascending: false })
  },

  async getAnalytics(dateRange?: { start: string; end: string }) {
    const { data: totalUsers } = await supabase.from("users").select("id", { count: "exact", head: true })

    const { data: activeUsers } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("last_seen", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const { data: newUsers } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("signup_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      newUsers: newUsers || 0,
    }
  },

  async getRFMDistribution() {
    return supabase.from("users").select("rfm_score").not("rfm_score", "is", null)
  },

  async getGeoDistribution() {
    return supabase.from("users").select("country").not("country", "is", null)
  },

  async getDeviceDistribution() {
    return supabase.from("users").select("device_type").not("device_type", "is", null)
  },
}

// Events API
export const eventsApi = {
  async getAll(filters?: {
    search?: string
    event_name?: string
    user_id?: string
    date_range?: { start: string; end: string }
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from("events")
      .select(`
        *,
        users (
          external_id,
          email,
          first_name,
          last_name
        )
      `)
      .order("timestamp", { ascending: false })

    if (filters?.search) {
      query = query.or(`event_name.ilike.%${filters.search}%,users.email.ilike.%${filters.search}%`)
    }

    if (filters?.event_name) {
      query = query.eq("event_name", filters.event_name)
    }

    if (filters?.user_id) {
      query = query.eq("user_id", filters.user_id)
    }

    if (filters?.date_range) {
      query = query.gte("timestamp", filters.date_range.start).lte("timestamp", filters.date_range.end)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    return query
  },

  async getEventNames() {
    return supabase.from("events").select("event_name").order("event_name")
  },

  async getEventAnalytics(dateRange?: { start: string; end: string }) {
    let query = supabase.from("events").select("event_name, timestamp")

    if (dateRange) {
      query = query.gte("timestamp", dateRange.start).lte("timestamp", dateRange.end)
    }

    return query
  },

  async create(event: Omit<Event, "id" | "created_at">) {
    return supabase.from("events").insert(event).select().single()
  },
}

// Segments API
export const segmentsApi = {
  async getAll() {
    return supabase.from("segments").select("*").order("created_at", { ascending: false })
  },

  async getById(id: string) {
    return supabase.from("segments").select("*").eq("id", id).single()
  },

  async create(segment: Omit<Segment, "id" | "created_at" | "updated_at">) {
    return supabase.from("segments").insert(segment).select().single()
  },

  async update(id: string, updates: Partial<Segment>) {
    return supabase
      .from("segments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
  },

  async delete(id: string) {
    return supabase.from("segments").delete().eq("id", id)
  },

  async getUsers(segmentId: string, limit = 100) {
    // This would need more complex logic based on segment criteria
    // For now, return users from segment_users table for static segments
    return supabase
      .from("segment_users")
      .select(`
        users (*)
      `)
      .eq("segment_id", segmentId)
      .limit(limit)
  },

  async previewSegment(criteria: Record<string, any>) {
    // This would evaluate the criteria and return matching user count
    // Simplified implementation
    const { count } = await supabase.from("users").select("*", { count: "exact", head: true })

    return { count: count || 0 }
  },
}

// Campaigns API
export const campaignsApi = {
  async getAll(filters?: {
    status?: string
    type?: string
    search?: string
  }) {
    let query = supabase
      .from("campaigns")
      .select(`
        *,
        segments (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.type) {
      query = query.eq("type", filters.type)
    }

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`)
    }

    return query
  },

  async getById(id: string) {
    return supabase
      .from("campaigns")
      .select(`
        *,
        segments (
          id,
          name,
          user_count
        )
      `)
      .eq("id", id)
      .single()
  },

  async create(campaign: Omit<Campaign, "id" | "created_at" | "updated_at">) {
    return supabase.from("campaigns").insert(campaign).select().single()
  },

  async update(id: string, updates: Partial<Campaign>) {
    return supabase
      .from("campaigns")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
  },

  async delete(id: string) {
    return supabase.from("campaigns").delete().eq("id", id)
  },

  async getAnalytics(campaignId: string) {
    return supabase.from("campaign_sends").select("*").eq("campaign_id", campaignId)
  },

  async getCampaignSends(campaignId: string, limit = 100) {
    return supabase
      .from("campaign_sends")
      .select(`
        *,
        users (
          external_id,
          email,
          first_name,
          last_name
        )
      `)
      .eq("campaign_id", campaignId)
      .order("sent_at", { ascending: false })
      .limit(limit)
  },
}

// System Monitoring API
export const monitoringApi = {
  async getLogs(filters?: {
    level?: string
    service?: string
    limit?: number
  }) {
    let query = supabase.from("system_logs").select("*").order("timestamp", { ascending: false })

    if (filters?.level) {
      query = query.eq("level", filters.level)
    }

    if (filters?.service) {
      query = query.eq("service", filters.service)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    return query
  },

  async getApiUsage(dateRange?: { start: string; end: string }) {
    let query = supabase.from("api_usage").select("*").order("timestamp", { ascending: false })

    if (dateRange) {
      query = query.gte("timestamp", dateRange.start).lte("timestamp", dateRange.end)
    }

    return query
  },

  async getSystemHealth() {
    const { data: errorLogs } = await supabase
      .from("system_logs")
      .select("id", { count: "exact", head: true })
      .eq("level", "error")
      .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const { data: totalRequests } = await supabase
      .from("api_usage")
      .select("id", { count: "exact", head: true })
      .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const { data: errorRequests } = await supabase
      .from("api_usage")
      .select("id", { count: "exact", head: true })
      .gte("status_code", 400)
      .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    return {
      errorLogs: errorLogs || 0,
      totalRequests: totalRequests || 0,
      errorRequests: errorRequests || 0,
      errorRate: totalRequests ? ((errorRequests || 0) / totalRequests) * 100 : 0,
    }
  },
}
