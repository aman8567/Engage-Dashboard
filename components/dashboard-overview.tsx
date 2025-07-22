"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Zap,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  MoreHorizontal,
  Eye,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const dailyActiveUsers = [
  { date: "2024-01-01", users: 12400 },
  { date: "2024-01-02", users: 13200 },
  { date: "2024-01-03", users: 11800 },
  { date: "2024-01-04", users: 14100 },
  { date: "2024-01-05", users: 15300 },
  { date: "2024-01-06", users: 16200 },
  { date: "2024-01-07", users: 15800 },
]

const eventData = [
  { name: "Page View", count: 45231 },
  { name: "Button Click", count: 23421 },
  { name: "Form Submit", count: 12341 },
  { name: "Purchase", count: 8234 },
  { name: "Sign Up", count: 5432 },
]

const conversionFunnel = [
  { stage: "Visitors", count: 100000, percentage: 100 },
  { stage: "Sign Up", count: 25000, percentage: 25 },
  { stage: "Email Verified", count: 20000, percentage: 20 },
  { stage: "First Purchase", count: 8000, percentage: 8 },
  { stage: "Repeat Purchase", count: 3200, percentage: 3.2 },
]

const recentCampaigns = [
  {
    id: 1,
    name: "Welcome Series",
    type: "Email",
    status: "Active",
    sent: 12450,
    opened: 8234,
    clicked: 2341,
    converted: 456,
    ctr: "28.4%",
    conversionRate: "5.5%",
  },
  {
    id: 2,
    name: "Flash Sale Push",
    type: "Push",
    status: "Completed",
    sent: 45230,
    opened: 23421,
    clicked: 8234,
    converted: 1234,
    ctr: "35.2%",
    conversionRate: "15.0%",
  },
  {
    id: 3,
    name: "Abandoned Cart SMS",
    type: "SMS",
    status: "Active",
    sent: 8934,
    opened: 7234,
    clicked: 2341,
    converted: 789,
    ctr: "32.4%",
    conversionRate: "33.7%",
  },
  {
    id: 4,
    name: "Product Recommendation",
    type: "In-App",
    status: "Draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    ctr: "0%",
    conversionRate: "0%",
  },
]

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your customer engagement and campaign performance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,847</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +12.5% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Events</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,234</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +8.2% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDownRight className="mr-1 h-3 w-3" />
              -0.3% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +3 new this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>User activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
            <CardDescription>Most triggered events today</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from visitor to repeat customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => (
              <div key={stage.stage} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium">{stage.stage}</div>
                <div className="flex-1">
                  <Progress value={stage.percentage} className="h-6" />
                </div>
                <div className="w-20 text-sm text-right">{stage.count.toLocaleString()}</div>
                <div className="w-16 text-sm text-right text-gray-500">{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Performance overview of your latest campaigns</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "Active"
                          ? "default"
                          : campaign.status === "Completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell>{campaign.opened.toLocaleString()}</TableCell>
                  <TableCell>{campaign.ctr}</TableCell>
                  <TableCell>{campaign.conversionRate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
