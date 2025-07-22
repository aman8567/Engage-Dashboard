"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Zap,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  Play,
  RefreshCw,
  Download,
  Globe,
  Smartphone,
  Bell,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { usersApi, eventsApi, campaignsApi, monitoringApi } from "@/lib/api"

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"]

export function AdvancedDashboard() {
  const [dateRange, setDateRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>({
    userAnalytics: null,
    eventAnalytics: null,
    campaignAnalytics: null,
    systemHealth: null,
    realtimeMetrics: null,
  })

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [userAnalytics, eventAnalytics, campaigns, systemHealth] = await Promise.all([
        usersApi.getAnalytics(),
        eventsApi.getEventAnalytics(),
        campaignsApi.getAll({ status: "active" }),
        monitoringApi.getSystemHealth(),
      ])

      setDashboardData({
        userAnalytics: userAnalytics,
        eventAnalytics: eventAnalytics.data,
        campaignAnalytics: campaigns.data,
        systemHealth: systemHealth,
        realtimeMetrics: {
          activeUsers: 15847,
          eventsPerSecond: 234,
          campaignsRunning: campaigns.data?.length || 0,
          systemUptime: 99.9,
        },
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const { userAnalytics, eventAnalytics, campaignAnalytics, systemHealth, realtimeMetrics } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights and comprehensive analytics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadDashboardData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.activeUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +12.5% from last hour
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events/Second</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.eventsPerSecond}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +8.2% from average
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.campaignsRunning}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Play className="mr-1 h-3 w-3" />2 scheduled today
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeMetrics.systemUptime}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              99.9% SLA maintained
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="events">Event Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* User Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Daily active users vs new signups</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      { date: "2024-01-01", activeUsers: 12400, newUsers: 340 },
                      { date: "2024-01-02", activeUsers: 13200, newUsers: 420 },
                      { date: "2024-01-03", activeUsers: 11800, newUsers: 280 },
                      { date: "2024-01-04", activeUsers: 14100, newUsers: 510 },
                      { date: "2024-01-05", activeUsers: 15300, newUsers: 680 },
                      { date: "2024-01-06", activeUsers: 16200, newUsers: 720 },
                      { date: "2024-01-07", activeUsers: 15800, newUsers: 590 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      stackId="2"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>Top events by volume today</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "page_view", value: 45231, color: "#3B82F6" },
                        { name: "button_click", value: 23421, color: "#8B5CF6" },
                        { name: "purchase", value: 12341, color: "#10B981" },
                        { name: "form_submit", value: 8234, color: "#F59E0B" },
                        { name: "video_watch", value: 5432, color: "#EF4444" },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: "page_view", value: 45231, color: "#3B82F6" },
                        { name: "button_click", value: 23421, color: "#8B5CF6" },
                        { name: "purchase", value: 12341, color: "#10B981" },
                        { name: "form_submit", value: 8234, color: "#F59E0B" },
                        { name: "video_watch", value: 5432, color: "#EF4444" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Summary</CardTitle>
              <CardDescription>Overview of active campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">32.4%</div>
                  <p className="text-sm text-gray-600">Avg CTR</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">$247K</div>
                  <p className="text-sm text-gray-600">Revenue Generated</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { channel: "Email", campaigns: 8, ctr: 28.4, revenue: 89000 },
                    { channel: "Push", campaigns: 6, ctr: 35.2, revenue: 67000 },
                    { channel: "SMS", campaigns: 4, ctr: 42.1, revenue: 45000 },
                    { channel: "In-App", campaigns: 3, ctr: 18.7, revenue: 23000 },
                    { channel: "WhatsApp", campaigns: 3, ctr: 38.9, revenue: 23000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="campaigns" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userAnalytics?.totalUsers?.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userAnalytics?.activeUsers?.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">+8.2% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users (7d)</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userAnalytics?.newUsers?.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">+15.3% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.4%</div>
                <p className="text-xs text-muted-foreground">7-day retention</p>
              </CardContent>
            </Card>
          </div>

          {/* User Segmentation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: "United States", users: 12450, percentage: 35.2 },
                    { country: "India", users: 8934, percentage: 25.3 },
                    { country: "United Kingdom", users: 4567, percentage: 12.9 },
                    { country: "Germany", users: 3421, percentage: 9.7 },
                    { country: "Canada", users: 2341, percentage: 6.6 },
                  ].map((item) => (
                    <div key={item.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{item.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{item.users.toLocaleString()}</span>
                        <Badge variant="outline">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Users by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { device: "Mobile", users: 45231, percentage: 65.2, icon: Smartphone },
                    { device: "Desktop", users: 19432, percentage: 28.0, icon: Globe },
                    { device: "Tablet", users: 4867, percentage: 6.8, icon: Smartphone },
                  ].map((item) => (
                    <div key={item.device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{item.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{item.users.toLocaleString()}</span>
                        <Badge variant="outline">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth?.errorRate?.toFixed(2) || "0.00"}%</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth?.totalRequests?.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Logs</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth?.errorLogs?.toLocaleString() || "0"}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Logs</CardTitle>
              <CardDescription>Latest system events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    level: "error",
                    service: "email_service",
                    message: "Failed to send email batch",
                    time: "2 minutes ago",
                  },
                  {
                    level: "warning",
                    service: "push_service",
                    message: "High bounce rate detected",
                    time: "5 minutes ago",
                  },
                  {
                    level: "info",
                    service: "campaign_service",
                    message: "Campaign 'Welcome Series' completed",
                    time: "10 minutes ago",
                  },
                  {
                    level: "info",
                    service: "segment_service",
                    message: "Segment 'High Value Users' updated",
                    time: "15 minutes ago",
                  },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          log.level === "error" ? "destructive" : log.level === "warning" ? "secondary" : "outline"
                        }
                      >
                        {log.level}
                      </Badge>
                      <span className="text-sm font-medium">{log.service}</span>
                      <span className="text-sm text-gray-600">{log.message}</span>
                    </div>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
