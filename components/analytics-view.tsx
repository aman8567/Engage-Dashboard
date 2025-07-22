"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, Filter, RefreshCw, TrendingUp, Users, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const userAnalytics = [
  { date: "2024-01-01", newUsers: 1240, returningUsers: 3420, sessions: 5680 },
  { date: "2024-01-02", newUsers: 1320, returningUsers: 3620, sessions: 6120 },
  { date: "2024-01-03", newUsers: 1180, returningUsers: 3280, sessions: 5340 },
  { date: "2024-01-04", newUsers: 1410, returningUsers: 3890, sessions: 6450 },
  { date: "2024-01-05", newUsers: 1530, returningUsers: 4120, sessions: 6890 },
  { date: "2024-01-06", newUsers: 1620, returningUsers: 4350, sessions: 7230 },
  { date: "2024-01-07", newUsers: 1580, returningUsers: 4180, sessions: 6980 },
]

const deviceData = [
  { name: "Mobile", value: 65, count: 45231 },
  { name: "Desktop", value: 28, count: 19432 },
  { name: "Tablet", value: 7, count: 4867 },
]

const locationData = [
  { country: "United States", users: 12450, percentage: 35.2 },
  { country: "India", users: 8934, percentage: 25.3 },
  { country: "United Kingdom", users: 4567, percentage: 12.9 },
  { country: "Germany", users: 3421, percentage: 9.7 },
  { country: "Canada", users: 2341, percentage: 6.6 },
  { country: "Others", users: 3654, percentage: 10.3 },
]

const cohortData = [
  { week: "Week 1", retention: 100 },
  { week: "Week 2", retention: 45 },
  { week: "Week 3", retention: 32 },
  { week: "Week 4", retention: 28 },
  { week: "Week 5", retention: 25 },
  { week: "Week 6", retention: 23 },
  { week: "Week 7", retention: 21 },
  { week: "Week 8", retention: 20 },
]

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"]

export function AnalyticsView() {
  const [dateRange, setDateRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Deep insights into user behavior and engagement</p>
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
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="rfm">RFM Segmentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">69,530</div>
                <p className="text-xs text-muted-foreground">+12.5% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,890</div>
                <p className="text-xs text-muted-foreground">+8.2% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4m 32s</div>
                <p className="text-xs text-muted-foreground">+15.3% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.4%</div>
                <p className="text-xs text-muted-foreground">-2.1% from last period</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New vs returning users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="returningUsers" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>User sessions by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Data */}
          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>User distribution by country</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationData.map((location) => (
                    <TableRow key={location.country}>
                      <TableCell className="font-medium">{location.country}</TableCell>
                      <TableCell>{location.users.toLocaleString()}</TableCell>
                      <TableCell>{location.percentage}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          +{Math.floor(Math.random() * 10 + 1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohort" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Retention Analysis</CardTitle>
              <CardDescription>User retention over time by cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="retention" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Builder</CardTitle>
              <CardDescription>Create custom funnels to analyze user journeys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label>Step 1</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page_view">Page View</SelectItem>
                        <SelectItem value="sign_up">Sign Up</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Step 2</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page_view">Page View</SelectItem>
                        <SelectItem value="sign_up">Sign Up</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Step 3</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page_view">Page View</SelectItem>
                        <SelectItem value="sign_up">Sign Up</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Analyze Funnel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFM Segmentation</CardTitle>
              <CardDescription>Recency, Frequency, Monetary analysis of your users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Champions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">2,341</div>
                    <p className="text-sm text-muted-foreground">High value, frequent buyers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">At Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">1,234</div>
                    <p className="text-sm text-muted-foreground">Haven't purchased recently</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lost Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">567</div>
                    <p className="text-sm text-muted-foreground">Need win-back campaigns</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
