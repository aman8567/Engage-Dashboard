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

// Mock data for development
const mockCampaigns = [
  {
    id: "1",
    name: "Welcome Email Series",
    description: "Onboarding series for new users",
    type: "email",
    status: "active",
    subject: "Welcome to Our Platform",
    content: "Hi {{first_name}}, welcome to our platform!",
    trigger_type: "event",
    is_journey: true,
    is_ab_test: false,
    goal_type: "engagement",
    total_sent: 1250,
    total_delivered: 1200,
    total_opened: 950,
    total_clicked: 450,
    total_converted: 120,
    total_revenue: 5600,
    created_at: "2023-01-15T10:30:00Z",
    segments: { name: "New Users", user_count: 1500 },
  },
  {
    id: "2",
    name: "Flash Sale",
    description: "Limited time promotion",
    type: "email",
    status: "completed",
    subject: "24-Hour Flash Sale!",
    content: "Hi {{first_name}}, don't miss our 24-hour flash sale!",
    trigger_type: "scheduled",
    is_journey: false,
    is_ab_test: true,
    goal_type: "revenue",
    total_sent: 5000,
    total_delivered: 4850,
    total_opened: 3200,
    total_clicked: 1800,
    total_converted: 450,
    total_revenue: 22500,
    created_at: "2023-02-10T08:15:00Z",
    segments: { name: "All Customers", user_count: 5000 },
  },
  {
    id: "3",
    name: "Appointment Reminder",
    description: "SMS reminder for upcoming appointments",
    type: "sms",
    status: "active",
    content: "Hi {{first_name}}, reminder: your appointment is tomorrow at {{time}}.",
    trigger_type: "scheduled",
    is_journey: false,
    is_ab_test: false,
    goal_type: "conversion",
    total_sent: 750,
    total_delivered: 740,
    total_opened: 0,
    total_clicked: 0,
    total_converted: 680,
    total_revenue: 0,
    created_at: "2023-03-05T14:45:00Z",
    segments: { name: "Appointment Customers", user_count: 800 },
  },
  {
    id: "4",
    name: "New Feature Announcement",
    description: "Push notification for new app features",
    type: "push",
    status: "draft",
    subject: "New Features Available!",
    content: "Hi {{first_name}}, check out our latest features!",
    trigger_type: "manual",
    is_journey: false,
    is_ab_test: false,
    goal_type: "engagement",
    total_sent: 0,
    total_delivered: 0,
    total_opened: 0,
    total_clicked: 0,
    total_converted: 0,
    total_revenue: 0,
    created_at: "2023-04-20T09:00:00Z",
    segments: { name: "Active App Users", user_count: 3200 },
  },
  {
    id: "5",
    name: "Re-engagement Campaign",
    description: "Win back inactive users",
    type: "email",
    status: "scheduled",
    subject: "We Miss You!",
    content: "Hi {{first_name}}, it's been a while since we've seen you.",
    trigger_type: "scheduled",
    is_journey: false,
    is_ab_test: true,
    goal_type: "engagement",
    total_sent: 0,
    total_delivered: 0,
    total_opened: 0,
    total_clicked: 0,
    total_converted: 0,
    total_revenue: 0,
    created_at: "2023-05-12T11:30:00Z",
    segments: { name: "Inactive Users", user_count: 2500 },
  },
]

const mockSegments = [
  {
    id: "1",
    name: "New Users",
    user_count: 1500,
    type: "dynamic",
    status: "active",
    created_at: "2023-01-10T08:00:00Z",
  },
  {
    id: "2",
    name: "All Customers",
    user_count: 5000,
    type: "dynamic",
    status: "active",
    created_at: "2023-01-05T10:15:00Z",
  },
  {
    id: "3",
    name: "Appointment Customers",
    user_count: 800,
    type: "dynamic",
    status: "active",
    created_at: "2023-02-15T14:30:00Z",
  },
  {
    id: "4",
    name: "Active App Users",
    user_count: 3200,
    type: "dynamic",
    status: "active",
    created_at: "2023-03-20T09:45:00Z",
  },
  {
    id: "5",
    name: "Inactive Users",
    user_count: 2500,
    type: "dynamic",
    status: "active",
    created_at: "2023-04-05T11:20:00Z",
  },
]

const mockChannels = [
  { id: "1", name: "Transactional Email", type: "email", provider: "SendGrid", is_active: true },
  { id: "2", name: "Marketing Email", type: "email", provider: "Mailchimp", is_active: true },
  { id: "3", name: "SMS Notifications", type: "sms", provider: "Twilio", is_active: true },
  { id: "4", name: "WhatsApp Business", type: "whatsapp", provider: "Twilio", is_active: true },
  { id: "5", name: "Mobile Push", type: "push", provider: "Firebase", is_active: true },
]

const mockTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    type: "email",
    category: "onboarding",
    subject: "Welcome to Our Platform!",
    content: "Hi {{first_name}}, Welcome to our platform!",
    is_active: true,
  },
  {
    id: "2",
    name: "Password Reset",
    type: "email",
    category: "transactional",
    subject: "Reset Your Password",
    content: "Hi {{first_name}}, Click the link to reset your password: {{reset_link}}",
    is_active: true,
  },
  {
    id: "3",
    name: "Order Confirmation",
    type: "email",
    category: "transactional",
    subject: "Your Order #{{order_id}} is Confirmed",
    content: "Hi {{first_name}}, Your order #{{order_id}} has been confirmed.",
    is_active: true,
  },
  {
    id: "4",
    name: "Appointment Reminder",
    type: "sms",
    category: "transactional",
    content: "Hi {{first_name}}, reminder: your appointment is scheduled for {{appointment_time}}.",
    is_active: true,
  },
  {
    id: "5",
    name: "Promotional Offer",
    type: "push",
    category: "marketing",
    subject: "Special Offer Inside!",
    content: "Hi {{first_name}}, enjoy 20% off your next purchase with code: {{promo_code}}",
    is_active: true,
  },
]

const mockInboxMessages = [
  {
    id: "1",
    contact_id: "1",
    channel_type: "email",
    direction: "inbound",
    subject: "Question about subscription",
    content: "Hi, I have a question about my subscription plan. Can you help?",
    status: "unread",
    priority: "high",
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    contacts: { first_name: "Alex", last_name: "Johnson", email: "alex@example.com", company: "Acme Inc" },
  },
  {
    id: "2",
    contact_id: "2",
    channel_type: "email",
    direction: "inbound",
    subject: "Technical issue",
    content: "I'm experiencing a technical issue with the platform. The dashboard isn't loading correctly.",
    status: "read",
    priority: "normal",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    contacts: { first_name: "Emma", last_name: "Wilson", email: "emma@example.com", company: "XYZ Corp" },
  },
  {
    id: "3",
    contact_id: "3",
    channel_type: "whatsapp",
    direction: "inbound",
    content: "Is there a way to upgrade my account to the premium plan?",
    status: "unread",
    priority: "normal",
    created_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    contacts: { first_name: "Michael", last_name: "Brown", email: "michael@example.com", company: "ABC Ltd" },
  },
  {
    id: "4",
    contact_id: "4",
    channel_type: "sms",
    direction: "inbound",
    content: "HELP: I need assistance with my account",
    status: "unread",
    priority: "urgent",
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    contacts: { first_name: "Sophia", last_name: "Garcia", email: "sophia@example.com", company: "Tech Solutions" },
  },
  {
    id: "5",
    contact_id: "5",
    channel_type: "email",
    direction: "inbound",
    subject: "Feedback on new features",
    content: "I love the new features you added! The dashboard is much more intuitive now.",
    status: "read",
    priority: "low",
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    contacts: { first_name: "James", last_name: "Miller", email: "james@example.com", company: "Global Retail" },
  },
]

const mockTeamMembers = [
  { id: "1", first_name: "John", last_name: "Doe", email: "john@example.com", role: "admin", is_active: true },
  { id: "2", first_name: "Jane", last_name: "Smith", email: "jane@example.com", role: "marketer", is_active: true },
  { id: "3", first_name: "Mike", last_name: "Johnson", email: "mike@example.com", role: "support", is_active: true },
  { id: "4", first_name: "Sarah", last_name: "Williams", email: "sarah@example.com", role: "analyst", is_active: true },
]

// Advanced Campaigns API
export const advancedCampaignsApi = {
  async getAll() {
    try {
      // For development, return mock data
      return { data: mockCampaigns, error: null }

      // For production with Supabase:
      /*
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
        .order("created_at", { ascending: false });
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      return { data: [], error }
    }
  },

  async getById(id: string) {
    try {
      // For development, return mock data
      const campaign = mockCampaigns.find((c) => c.id === id)
      return { data: campaign || null, error: campaign ? null : "Campaign not found" }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("advanced_campaigns")
        .select("*")
        .eq("id", id)
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching campaign:", error)
      return { data: null, error }
    }
  },

  async create(campaign: Partial<AdvancedCampaign>) {
    try {
      // For development, return mock success
      const newId = (mockCampaigns.length + 1).toString()
      const newCampaign = {
        ...campaign,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return { data: newCampaign, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("advanced_campaigns")
        .insert([campaign])
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error creating campaign:", error)
      return { data: null, error }
    }
  },

  async update(id: string, updates: Partial<AdvancedCampaign>) {
    try {
      // For development, return mock success
      return {
        data: {
          ...mockCampaigns.find((c) => c.id === id),
          ...updates,
          updated_at: new Date().toISOString(),
        },
        error: null,
      }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("advanced_campaigns")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error updating campaign:", error)
      return { data: null, error }
    }
  },

  async delete(id: string) {
    try {
      // For development, return mock success
      return { error: null }

      // For production with Supabase:
      /*
      const { error } = await supabase
        .from("advanced_campaigns")
        .delete()
        .eq("id", id);
      
      return { error };
      */
    } catch (error) {
      console.error("Error deleting campaign:", error)
      return { error }
    }
  },

  async sendCampaign(id: string) {
    try {
      // For development, return mock success
      return {
        data: {
          ...mockCampaigns.find((c) => c.id === id),
          status: "active",
          updated_at: new Date().toISOString(),
        },
        error: null,
      }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("advanced_campaigns")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error sending campaign:", error)
      return { data: null, error }
    }
  },
}

// Communication Channels API
export const channelsApi = {
  async getAll() {
    try {
      // For development, return mock data
      return { data: mockChannels, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("communication_channels")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching channels:", error)
      return { data: [], error }
    }
  },

  async create(channel: Partial<CommunicationChannel>) {
    try {
      // For development, return mock success
      const newId = (mockChannels.length + 1).toString()
      const newChannel = {
        ...channel,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return { data: newChannel, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("communication_channels")
        .insert([channel])
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error creating channel:", error)
      return { data: null, error }
    }
  },
}

// Templates API
export const templatesApi = {
  async getAll(type?: string) {
    try {
      // For development, return mock data
      let templates = [...mockTemplates]
      if (type) {
        templates = templates.filter((t) => t.type === type)
      }
      return { data: templates, error: null }

      // For production with Supabase:
      /*
      let query = supabase
        .from("templates")
        .select("*")
        .eq("is_active", true);

      if (type) {
        query = query.eq("type", type);
      }

      const { data, error } = await query.order("name");
      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching templates:", error)
      return { data: [], error }
    }
  },

  async create(template: Partial<Template>) {
    try {
      // For development, return mock success
      const newId = (mockTemplates.length + 1).toString()
      const newTemplate = {
        ...template,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return { data: newTemplate, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("templates")
        .insert([template])
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error creating template:", error)
      return { data: null, error }
    }
  },
}

// Segments API
export const segmentsApi = {
  async getAll() {
    try {
      // For development, return mock data
      return { data: mockSegments, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("segments")
        .select("*")
        .order("name");
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching segments:", error)
      return { data: [], error }
    }
  },

  async create(segment: any) {
    try {
      // For development, return mock success
      const newId = (mockSegments.length + 1).toString()
      const newSegment = {
        ...segment,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return { data: newSegment, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("segments")
        .insert([segment])
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error creating segment:", error)
      return { data: null, error }
    }
  },

  async previewSegment(criteria: any) {
    // Mock function to simulate segment preview
    return { count: Math.floor(Math.random() * 5000) + 500 }
  },
}

// Inbox Messages API
export const inboxApi = {
  async getAll(filters?: any) {
    try {
      // For development, return mock data
      let messages = [...mockInboxMessages]

      if (filters?.status) {
        messages = messages.filter((m) => m.status === filters.status)
      }

      if (filters?.channel_type) {
        messages = messages.filter((m) => m.channel_type === filters.channel_type)
      }

      if (filters?.priority) {
        messages = messages.filter((m) => m.priority === filters.priority)
      }

      return { data: messages, error: null }

      // For production with Supabase:
      /*
      let query = supabase
        .from("inbox_messages")
        .select(`
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
        `);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.channel_type) {
        query = query.eq("channel_type", filters.channel_type);
      }

      if (filters?.priority) {
        query = query.eq("priority", filters.priority);
      }

      if (filters?.assigned_to) {
        query = query.eq("assigned_to", filters.assigned_to);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(filters?.limit || 100);

      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching inbox messages:", error)
      return { data: [], error }
    }
  },

  async updateStatus(id: string, status: string) {
    try {
      // For development, return mock success
      const message = mockInboxMessages.find((m) => m.id === id)
      if (message) {
        message.status = status
      }

      return { data: message, error: null }

      // For production with Supabase:
      /*
      const updates: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (status === "read") {
        updates.read_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("inbox_messages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error updating message status:", error)
      return { data: null, error }
    }
  },

  async assignMessage(id: string, assignedTo: string) {
    try {
      // For development, return mock success
      const message = mockInboxMessages.find((m) => m.id === id)
      if (message) {
        message.assigned_to = assignedTo
      }

      return { data: message, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("inbox_messages")
        .update({
          assigned_to: assignedTo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error assigning message:", error)
      return { data: null, error }
    }
  },

  async reply(messageId: string, content: string) {
    try {
      // For development, return mock success
      const originalMessage = mockInboxMessages.find((m) => m.id === messageId)

      if (!originalMessage) {
        return { data: null, error: "Original message not found" }
      }

      const replyMessage = {
        id: `reply-${Date.now()}`,
        contact_id: originalMessage.contact_id,
        channel_type: originalMessage.channel_type,
        direction: "outbound",
        subject: originalMessage.subject ? `Re: ${originalMessage.subject}` : undefined,
        content,
        status: "sent",
        priority: originalMessage.priority,
        thread_id: originalMessage.thread_id || messageId,
        parent_message_id: messageId,
        created_at: new Date().toISOString(),
        contacts: originalMessage.contacts,
      }

      // Update original message status to replied
      originalMessage.status = "replied"

      return { data: replyMessage, error: null }

      // For production with Supabase:
      /*
      const { data: originalMessage, error: fetchError } = await supabase
        .from("inbox_messages")
        .select("*")
        .eq("id", messageId)
        .single();

      if (fetchError || !originalMessage) {
        return { data: null, error: fetchError || "Original message not found" };
      }

      const { data, error } = await supabase
        .from("inbox_messages")
        .insert([{
          contact_id: originalMessage.contact_id,
          channel_type: originalMessage.channel_type,
          direction: "outbound",
          subject: originalMessage.subject ? `Re: ${originalMessage.subject}` : undefined,
          content,
          status: "sent",
          priority: originalMessage.priority,
          thread_id: originalMessage.thread_id || messageId,
          parent_message_id: messageId,
          sent_at: new Date().toISOString(),
        }])
        .select()
        .single();

      // Update original message status to replied
      await supabase
        .from("inbox_messages")
        .update({
          status: "replied",
          replied_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", messageId);

      return { data, error };
      */
    } catch (error) {
      console.error("Error sending reply:", error)
      return { data: null, error }
    }
  },
}

// Team Members API
export const teamApi = {
  async getAll() {
    try {
      // For development, return mock data
      return { data: mockTeamMembers, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("first_name");
      
      return { data, error };
      */
    } catch (error) {
      console.error("Error fetching team members:", error)
      return { data: [], error }
    }
  },
}

// Analytics API
export const analyticsApi = {
  async getCampaignStats() {
    try {
      // For development, return mock data
      const stats = {
        total_campaigns: mockCampaigns.length,
        active_campaigns: mockCampaigns.filter((c) => c.status === "active").length,
        total_sent: mockCampaigns.reduce((sum, c) => sum + c.total_sent, 0),
        total_opened: mockCampaigns.reduce((sum, c) => sum + c.total_opened, 0),
        total_clicked: mockCampaigns.reduce((sum, c) => sum + c.total_clicked, 0),
        total_converted: mockCampaigns.reduce((sum, c) => sum + c.total_converted, 0),
        total_revenue: mockCampaigns.reduce((sum, c) => sum + c.total_revenue, 0),
      }

      return { data: stats, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("advanced_campaigns")
        .select("status, total_sent, total_opened, total_clicked, total_converted, total_revenue");

      if (error) return { data: null, error };

      const stats = {
        total_campaigns: data.length,
        active_campaigns: data.filter((c) => c.status === "active").length,
        total_sent: data.reduce((sum, c) => sum + c.total_sent, 0),
        total_opened: data.reduce((sum, c) => sum + c.total_opened, 0),
        total_clicked: data.reduce((sum, c) => sum + c.total_clicked, 0),
        total_converted: data.reduce((sum, c) => sum + c.total_converted, 0),
        total_revenue: data.reduce((sum, c) => sum + c.total_revenue, 0),
      };

      return { data: stats, error: null };
      */
    } catch (error) {
      console.error("Error fetching campaign stats:", error)
      return { data: null, error }
    }
  },

  async getInboxStats() {
    try {
      // For development, return mock data
      const stats = {
        total_messages: mockInboxMessages.length,
        unread_messages: mockInboxMessages.filter((m) => m.status === "unread").length,
        high_priority: mockInboxMessages.filter((m) => m.priority === "high" || m.priority === "urgent").length,
        by_channel: mockInboxMessages.reduce(
          (acc, m) => {
            acc[m.channel_type] = (acc[m.channel_type] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      }

      return { data: stats, error: null }

      // For production with Supabase:
      /*
      const { data, error } = await supabase
        .from("inbox_messages")
        .select("status, priority, channel_type");

      if (error) return { data: null, error };

      const stats = {
        total_messages: data.length,
        unread_messages: data.filter((m) => m.status === "unread").length,
        high_priority: data.filter((m) => m.priority === "high" || m.priority === "urgent").length,
        by_channel: data.reduce(
          (acc, m) => {
            acc[m.channel_type] = (acc[m.channel_type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };

      return { data: stats, error: null };
      */
    } catch (error) {
      console.error("Error fetching inbox stats:", error)
      return { data: null, error }
    }
  },
}

// Default export for campaigns (for backward compatibility)
export const campaignsApi = advancedCampaignsApi
