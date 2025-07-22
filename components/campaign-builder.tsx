"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Users,
  CalendarIcon,
  Clock,
  Target,
  Settings,
  Send,
  Save,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { campaignsApi, segmentsApi, templatesApi, channelsApi } from "@/lib/advanced-api"
import { toast } from "sonner"

const campaignTypes = [
  { id: "email", name: "Email Campaign", icon: Mail, description: "Send personalized emails to your audience" },
  { id: "sms", name: "SMS Campaign", icon: MessageSquare, description: "Reach customers via text messages" },
  { id: "whatsapp", name: "WhatsApp Campaign", icon: Phone, description: "Engage through WhatsApp Business" },
  { id: "push", name: "Push Notification", icon: Smartphone, description: "Send mobile push notifications" },
  { id: "journey", name: "Customer Journey", icon: Users, description: "Multi-step automated campaigns" },
]

export function CampaignBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "",
    description: "",
    subject: "",
    content: "",
    segment_id: "",
    template_id: "",
    schedule_type: "immediate",
    scheduled_at: null,
    ab_test_enabled: false,
    ab_test_percentage: 50,
    settings: {},
  })

  const [segments, setSegments] = useState([])
  const [templates, setTemplates] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [segmentsData, channelsData] = await Promise.all([segmentsApi.getAll(), channelsApi.getAll()])
      setSegments(segmentsData)
      setChannels(channelsData)
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Failed to load campaign data")
    }
  }

  const loadTemplates = async (type: string) => {
    try {
      const templatesData = await templatesApi.getAll(type)
      setTemplates(templatesData)
    } catch (error) {
      console.error("Failed to load templates:", error)
    }
  }

  const handleTypeSelect = (type: string) => {
    setCampaignData((prev) => ({ ...prev, type }))
    loadTemplates(type)
    setCurrentStep(2)
  }

  const handleSaveCampaign = async (status: "draft" | "active") => {
    setLoading(true)
    try {
      const campaignPayload = {
        ...campaignData,
        status,
        created_at: new Date().toISOString(),
      }

      await campaignsApi.create(campaignPayload)
      toast.success(`Campaign ${status === "draft" ? "saved as draft" : "launched"} successfully!`)

      // Reset form or redirect
      setCampaignData({
        name: "",
        type: "",
        description: "",
        subject: "",
        content: "",
        segment_id: "",
        template_id: "",
        schedule_type: "immediate",
        scheduled_at: null,
        ab_test_enabled: false,
        ab_test_percentage: 50,
        settings: {},
      })
      setCurrentStep(1)
    } catch (error) {
      console.error("Failed to save campaign:", error)
      toast.error("Failed to save campaign")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Campaign Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaignTypes.map((type) => (
                  <Card
                    key={type.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <CardHeader className="text-center">
                      {type.icon && <type.icon className="h-12 w-12 mx-auto mb-2 text-blue-600" />}
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={campaignData.name}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter campaign name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={campaignData.description}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your campaign"
                    />
                  </div>

                  {campaignData.type === 'email' && (
                    <div>
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        value={campaignData.subject}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter email subject"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Selected Type</Label>
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                      {campaignTypes.find(t => t.id === campaignData.type)?.icon && (\
                        <campaignTypes.find(t => t.id === campaignData.type)!.icon className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="font-medium">
                        {campaignTypes.find(t => t.id === campaignData.type)?.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>Template (Optional)</Label>
                    <Select 
                      value={campaignData.template_id} 
                      onValueChange={(value) => setCampaignData(prev => ({ ...prev, template_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Message Content</h4>
              <Textarea
                value={campaignData.content}
                onChange={(e) => setCampaignData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your message content..."
                className="min-h-[200px]"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Next: Audience
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Audience</h3>

              <div className="space-y-4">
                <div>
                  <Label>Target Segment</Label>
                  <Select
                    value={campaignData.segment_id}
                    onValueChange={(value) => setCampaignData((prev) => ({ ...prev, segment_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose target segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment: any) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{segment.name}</span>
                            <Badge variant="secondary">{segment.user_count || 0} users</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ab-test"
                    checked={campaignData.ab_test_enabled}
                    onCheckedChange={(checked) => setCampaignData((prev) => ({ ...prev, ab_test_enabled: checked }))}
                  />
                  <Label htmlFor="ab-test">Enable A/B Testing</Label>
                </div>

                {campaignData.ab_test_enabled && (
                  <div>
                    <Label>Test Split Percentage</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        min="10"
                        max="90"
                        value={campaignData.ab_test_percentage}
                        onChange={(e) =>
                          setCampaignData((prev) => ({ ...prev, ab_test_percentage: Number.parseInt(e.target.value) }))
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">
                        {campaignData.ab_test_percentage}% / {100 - campaignData.ab_test_percentage}% split
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>Next: Schedule</Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Schedule Campaign</h3>

              <div className="space-y-4">
                <div>
                  <Label>Schedule Type</Label>
                  <Select
                    value={campaignData.schedule_type}
                    onValueChange={(value) => setCampaignData((prev) => ({ ...prev, schedule_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      <SelectItem value="recurring">Recurring Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {campaignData.schedule_type === "scheduled" && (
                  <div>
                    <Label>Schedule Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Campaign Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Campaign Name:</span>
                  <span>{campaignData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{campaignTypes.find((t) => t.id === campaignData.type)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Target Segment:</span>
                  <span>{segments.find((s: any) => s.id === campaignData.segment_id)?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Schedule:</span>
                  <span>{campaignData.schedule_type === "immediate" ? "Send Immediately" : "Scheduled"}</span>
                </div>
                {campaignData.ab_test_enabled && (
                  <div className="flex justify-between">
                    <span className="font-medium">A/B Testing:</span>
                    <span>Enabled ({campaignData.ab_test_percentage}% split)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleSaveCampaign("draft")} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button onClick={() => handleSaveCampaign("active")} disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  Launch Campaign
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Builder</h1>
        <p className="text-gray-600 mt-2">Create and launch multi-channel marketing campaigns</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: "Type", icon: Target },
            { step: 2, title: "Content", icon: Settings },
            { step: 3, title: "Audience", icon: Users },
            { step: 4, title: "Schedule", icon: Clock },
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2",
                  currentStep >= step ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn("ml-2 text-sm font-medium", currentStep >= step ? "text-blue-600" : "text-gray-400")}>
                {title}
              </span>
              {step < 4 && (
                <div className={cn("w-16 h-0.5 ml-4", currentStep > step ? "bg-blue-600" : "bg-gray-300")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>
    </div>
  )
}
