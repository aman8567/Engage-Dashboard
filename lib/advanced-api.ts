import { supabase } from "./supabase"

// Types
export interface AdvancedCampaign {
  id: string
  name: string
  description?: string
  type: string
  status: string
  channel_id?: string
  segment_id?: string
  template_id?: string
  subject?: string
  content: string
  trigger_type: string
  trigger_config: any
  scheduled_at?: string
  is_journey: boolean
  journey_config: any
  is_ab_test: boolean
  ab_test_config: any
  goal_type: string
  goal_value: number
  frequency_cap: number
  frequency_period: string
  target_audience: any
  personalization_data: any
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_converted: number
  total_revenue: number
  total_unsubscribed: number
  total_bounced: number
  created_at: string
  updated_at: string
  segments?: any
}

export interface CommunicationChannel {
  id: string
  name: string
  type: string
  provider: string
  configuration: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  name: string
  type: string
  category: string
  subject?: string
  content: string
  variables: any
  preview_data: any
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  email?: string
  phone?: string
  first_name?: string
  last_name?: string
  company?: string
  job_title?: string
  lead_score: number
  lifecycle_stage: string
  lead_source?: string
  tags: string[]
  custom_attributes: any
  last_activity_at?: string
  created_at: string
  updated_at: string
}

export interface InboxMessage {
  id: string
  contact_id: string
  channel_type: string
  direction: string
  subject?: string
  content: string
  status: string
  priority: string
  assigned_to?: string
  thread_id?: string
  external_id?: string
  metadata: any
  created_at: string
  updated_at: string
  contacts?: Contact
  team_members?: any
}

// Advanced Campaigns API
export const advancedCampaignsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("advanced_campaigns")
      .select(`
        *,
        segments (
          id,
          name,
          user_count
        )
      `)
      .order("created_at", { ascending: false })

    return { data: data || [], error }
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("advanced_campaigns").select("*").eq("id", id).single()

    return { data, error }
  },

  async create(campaign: Partial<AdvancedCampaign>) {
    const { data, error } = await supabase.from("advanced_campaigns").insert([campaign]).select().single()

    return { data, error }
  },

  async update(id: string, updates: Partial<AdvancedCampaign>) {
    const { data, error } = await supabase
      .from("advanced_campaigns")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },

  async delete(id: string) {
    const { error } = await supabase.from("advanced_campaigns").delete().eq("id", id)

    return { error }
  },

  async sendCampaign(id: string) {
    const { data, error } = await supabase
      .from("advanced_campaigns")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },
}

// Communication Channels API
export const channelsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("communication_channels")
      .select("*")
      .eq("is_active", true)
      .order("name")

    return { data: data || [], error }
  },

  async create(channel: Partial<CommunicationChannel>) {
    const { data, error } = await supabase.from("communication_channels").insert([channel]).select().single()

    return { data, error }
  },
}

// Templates API
export const templatesApi = {
  async getAll(type?: string) {
    let query = supabase.from("templates").select("*").eq("is_active", true)

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query.order("name")
    return { data: data || [], error }
  },

  async create(template: Partial<Template>) {
    const { data, error } = await supabase.from("templates").insert([template]).select().single()

    return { data, error }
  },
}

// Segments API (using existing segments table)
export const segmentsApi = {
  async getAll() {
    const { data, error } = await supabase.from("segments").select("*").order("name")

    return { data: data || [], error }
  },
}

// Contacts API
export const contactsApi = {
  async getAll(filters?: any) {
    let query = supabase.from("contacts").select("*")

    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
      )
    }

    if (filters?.lifecycle_stage) {
      query = query.eq("lifecycle_stage", filters.lifecycle_stage)
    }

    const { data, error } = await query.order("lead_score", { ascending: false }).limit(100)

    return { data: data || [], error }
  },

  async create(contact: Partial<Contact>) {
    const { data, error } = await supabase.from("contacts").insert([contact]).select().single()

    return { data, error }
  },

  async update(id: string, updates: Partial<Contact>) {
    const { data, error } = await supabase
      .from("contacts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },
}

// Inbox Messages API
export const inboxApi = {
  async getAll(filters?: any) {
    let query = supabase.from("inbox_messages").select(`
        *,
        contacts (
          id,
          first_name,
          last_name,
          email,
          company
        ),
        team_members (
          id,
          first_name,
          last_name
        )
      `)

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.channel_type) {
      query = query.eq("channel_type", filters.channel_type)
    }

    if (filters?.assigned_to) {
      query = query.eq("assigned_to", filters.assigned_to)
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(100)

    return { data: data || [], error }
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from("inbox_messages")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },

  async assignMessage(id: string, assignedTo: string) {
    const { data, error } = await supabase
      .from("inbox_messages")
      .update({
        assigned_to: assignedTo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    return { data, error }
  },

  async reply(messageId: string, content: string) {
    // This would integrate with actual messaging services
    // For now, we'll create a new outbound message
    const originalMessage = await supabase.from("inbox_messages").select("*").eq("id", messageId).single()

    if (originalMessage.data) {
      const { data, error } = await supabase
        .from("inbox_messages")
        .insert([
          {
            contact_id: originalMessage.data.contact_id,
            channel_type: originalMessage.data.channel_type,
            direction: "outbound",
            content,
            status: "sent",
            thread_id: originalMessage.data.thread_id || messageId,
            metadata: { reply_to: messageId },
          },
        ])
        .select()
        .single()

      return { data, error }
    }

    return { data: null, error: "Original message not found" }
  },
}

// Team Members API
export const teamApi = {
  async getAll() {
    const { data, error } = await supabase.from("team_members").select("*").eq("is_active", true).order("first_name")

    return { data: data || [], error }
  },
}

// Analytics API
export const analyticsApi = {
  async getCampaignStats() {
    const { data, error } = await supabase
      .from("advanced_campaigns")
      .select("status, total_sent, total_opened, total_clicked, total_converted, total_revenue")

    if (error) return { data: null, error }

    const stats = {
      total_campaigns: data.length,
      active_campaigns: data.filter((c) => c.status === "active").length,
      total_sent: data.reduce((sum, c) => sum + c.total_sent, 0),
      total_opened: data.reduce((sum, c) => sum + c.total_opened, 0),
      total_clicked: data.reduce((sum, c) => sum + c.total_clicked, 0),
      total_converted: data.reduce((sum, c) => sum + c.total_converted, 0),
      total_revenue: data.reduce((sum, c) => sum + c.total_revenue, 0),
    }

    return { data: stats, error: null }
  },

  async getInboxStats() {
    const { data, error } = await supabase.from("inbox_messages").select("status, priority, channel_type")

    if (error) return { data: null, error }

    const stats = {
      total_messages: data.length,
      unread_messages: data.filter((m) => m.status === "unread").length,
      high_priority: data.filter((m) => m.priority === "high").length,
      by_channel: data.reduce(
        (acc, m) => {
          acc[m.channel_type] = (acc[m.channel_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    return { data: stats, error: null }
  },
}

// Default export for campaigns (for backward compatibility)
export const campaignsApi = advancedCampaignsApi
