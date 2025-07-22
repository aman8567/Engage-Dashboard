"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Send,
  Pause,
  Play,
  Eye,
  Edit,
  Copy,
  MessageSquare,
  Mail,
  Smartphone,
  Bell,
  Filter,
  Download,
  BarChart3,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const campaigns = [
  {
    id: 1,
    name: "Welcome Series",
    type: "Email",
    status: "Active",
    channel: "email",
    segment: "New Users",
    sent: 12450,
    delivered: 12234,
    opened: 8234,
    clicked: 2341,
    converted: 456,
    revenue: 45600,
    ctr: 28.4,
    conversionRate: 5.5,
    createdAt: "2024-01-10",
    lastSent: "2 hours ago",
  },
  {
    id: 2,
    name: "Flash Sale Push",
    type: "Push Notification",
    status: "Completed",
    channel: "push",
    segment: "High Value Customers",
    sent: 45230,
    delivered: 43421,
    opened: 23421,
    clicked: 8234,
    converted: 1234,
    revenue: 123400,
    ctr: 35.2,
    conversionRate: 15.0,
    createdAt: "2024-01-08",
    lastSent: "1 day ago",
  },
  {
    id: 3,
    name: "Abandoned Cart SMS",
    type: "SMS",
    status: "Active",
    channel: "sms",
    segment: "Cart Abandoners",
    sent: 8934,
    delivered: 8756,
    opened: 7234,
    clicked: 2341,
    converted: 789,
    revenue: 78900,
    ctr: 32.4,
    conversionRate: 33.7,
    createdAt: "2024-01-12",
    lastSent: "30 minutes ago",
  },
  {
    id: 4,
    name: "Product Recommendation",
    type: "In-App Message",
    status: "Draft",
    channel: "in_app",
    segment: "Active Users",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    createdAt: "2024-01-14",
    lastSent: "Never",
  },
  {
    id: 5,
    name: "Re-engagement Campaign",
    type: "WhatsApp",
    status: "Scheduled",
    channel: "whatsapp",
    segment: "Inactive Users",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    createdAt: "2024-01-13",
    lastSent: "Scheduled for tomorrow",
  },
]

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return <Mail className="h-4 w-4" />
    case "push":
      return <Bell className="h-4 w-4" />
    case "sms":
      return <Smartphone className="h-4 w-4" />
    case "in_app":
      return <MessageSquare className="h-4 w-4" />
    case "whatsapp":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Send className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "default"
    case "Completed":
      return "secondary"
    case "Draft":
      return "outline"
    case "Scheduled":
      return "default"
    case "Paused":
      return "destructive"
    default:
      return "outline"
  }
}

export function CampaignsView() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (selectedTab === "all") return true
    if (selectedTab === "active") return campaign.status === "Active"
    if (selectedTab === "draft") return campaign.status === "Draft"
    if (selectedTab === "completed") return campaign.status === "Completed"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage multi-channel marketing campaigns</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/campaigns/builder">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 created this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">33% of total campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$247,900</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>Manage your marketing campaigns across all channels</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="in_app">In-App</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {campaign.createdAt} • Last sent {campaign.lastSent}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(campaign.channel)}
                          <span className="capitalize">{campaign.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(campaign.status) as any}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>{campaign.segment}</TableCell>
                      <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell>{campaign.ctr}%</TableCell>
                      <TableCell>{campaign.conversionRate}%</TableCell>
                      <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          {campaign.status === "Active" ? (
                            <Button variant="ghost" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : campaign.status === "Draft" ? (
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
