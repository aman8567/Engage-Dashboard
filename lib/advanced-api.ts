import { supabase } from "./supabase"

// Contacts API
export const contactsApi = {
  async getAll(filters?: any) {
    let query = supabase.from("contacts").select("*")

    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
      )
    }

    if (filters?.lifecycle_stage) {
      query = query.eq("lifecycle_stage", filters.lifecycle_stage)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("contacts").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },

  async create(contact: any) {
    const { data, error } = await supabase.from("contacts").insert(contact).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from("contacts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("contacts").delete().eq("id", id)
    if (error) throw error
  },
}

// Campaigns API
export const campaignsApi = {
  async getAll() {
    const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data
  },

  async create(campaign: any) {
    const { data, error } = await supabase.from("campaigns").insert(campaign).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase.from("campaigns").update(updates).eq("id", id).select().single()
    if (error) throw error
    return data
  },
}

// Segments API
export const segmentsApi = {
  async getAll() {
    const { data, error } = await supabase.from("segments").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data
  },

  async create(segment: any) {
    const { data, error } = await supabase.from("segments").insert(segment).select().single()
    if (error) throw error
    return data
  },
}

// Templates API
export const templatesApi = {
  async getAll(type?: string) {
    let query = supabase.from("campaign_templates").select("*")

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    return data
  },

  async create(template: any) {
    const { data, error } = await supabase.from("campaign_templates").insert(template).select().single()
    if (error) throw error
    return data
  },
}

// Inbox API
export const inboxApi = {
  async getMessages(filters?: any) {
    let query = supabase.from("inbox_messages").select(`
        *,
        contacts (
          first_name,
          last_name,
          email,
          company
        )
      `)

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    if (filters?.channel) {
      query = query.eq("channel", filters.channel)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    return data
  },

  async updateMessage(id: string, updates: any) {
    const { data, error } = await supabase
      .from("inbox_messages")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async sendReply(messageId: string, content: string) {
    // Implementation for sending replies
    const { data, error } = await supabase
      .from("inbox_messages")
      .insert({
        contact_id: messageId, // This should be the contact_id from the original message
        channel: "email", // Default channel
        direction: "outbound",
        content,
        status: "sent",
      })
      .select()
      .single()
    if (error) throw error
    return data
  },
}

// Communication Channels API
export const channelsApi = {
  async getAll() {
    const { data, error } = await supabase.from("communication_channels").select("*").eq("is_active", true)
    if (error) throw error
    return data
  },
}

// Journey Touchpoints API
export const journeyApi = {
  async getTouchpoints(contactId: string) {
    const { data, error } = await supabase
      .from("journey_touchpoints")
      .select(`
        *,
        campaigns (name, type)
      `)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data
  },
}

// Analytics API
export const analyticsApi = {
  async getCampaignMetrics(campaignId: string) {
    const { data, error } = await supabase
      .from("journey_touchpoints")
      .select("status, touchpoint_type, channel")
      .eq("campaign_id", campaignId)
    if (error) throw error

    // Process metrics
    const metrics = {
      sent: data.length,
      delivered: data.filter((t) => t.status === "delivered").length,
      opened: data.filter((t) => t.status === "opened").length,
      clicked: data.filter((t) => t.status === "clicked").length,
      converted: data.filter((t) => t.status === "converted").length,
    }

    return metrics
  },

  async getOverallMetrics() {
    const { data: campaigns, error: campaignsError } = await supabase.from("campaigns").select("id, status")

    const { data: contacts, error: contactsError } = await supabase.from("contacts").select("id, lifecycle_stage")

    const { data: touchpoints, error: touchpointsError } = await supabase.from("journey_touchpoints").select("status")

    if (campaignsError || contactsError || touchpointsError) {
      throw new Error("Failed to fetch metrics")
    }

    return {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: campaigns?.filter((c) => c.status === "active").length || 0,
      totalContacts: contacts?.length || 0,
      totalTouchpoints: touchpoints?.length || 0,
      deliveryRate:
        touchpoints?.length > 0
          ? (touchpoints.filter((t) => t.status === "delivered").length / touchpoints.length) * 100
          : 0,
    }
  },
}
