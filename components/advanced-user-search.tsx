"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Smartphone,
  Globe,
  Clock,
  Bell,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usersApi } from "@/lib/api"
import type { User } from "@/lib/supabase"

interface UserSearchFilters {
  search: string
  country: string
  device_type: string
  subscription_tier: string
  rfm_score: string
  date_range: { start: string; end: string } | null
  custom_attributes: Record<string, string>
}

export function AdvancedUserSearch() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<UserSearchFilters>({
    search: "",
    country: "all", // Updated default value
    device_type: "all", // Updated default value
    subscription_tier: "", // Updated default value
    rfm_score: "", // Updated default value
    date_range: null,
    custom_attributes: {},
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    searchUsers()
  }, [])

  const searchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await usersApi.getAll({
        search: filters.search || undefined,
        country: filters.country || undefined,
        device_type: filters.device_type || undefined,
        subscription_tier: filters.subscription_tier || undefined,
        rfm_score: filters.rfm_score || undefined,
        date_range: filters.date_range || undefined,
        limit: 50,
      })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof UserSearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      country: "all", // Updated default value
      device_type: "all", // Updated default value
      subscription_tier: "", // Updated default value
      rfm_score: "", // Updated default value
      date_range: null,
      custom_attributes: {},
    })
  }

  const getRFMSegment = (score: string) => {
    if (!score) return "Unknown"
    const [r, f, m] = score.split("").map(Number)
    if (r >= 4 && f >= 4 && m >= 4) return "Champions"
    if (r >= 3 && f >= 3 && m >= 3) return "Loyal Customers"
    if (r >= 3 && f <= 2) return "Potential Loyalists"
    if (r <= 2 && f >= 3) return "At Risk"
    if (r <= 2 && f <= 2) return "Lost Customers"
    return "New Customers"
  }

  const getRFMColor = (segment: string) => {
    switch (segment) {
      case "Champions":
        return "bg-green-100 text-green-800"
      case "Loyal Customers":
        return "bg-blue-100 text-blue-800"
      case "Potential Loyalists":
        return "bg-yellow-100 text-yellow-800"
      case "At Risk":
        return "bg-orange-100 text-orange-800"
      case "Lost Customers":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Search & Analytics</h1>
          <p className="text-gray-600 mt-1">Advanced user search with comprehensive filtering and analytics</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Basic Search */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by email, name, or user ID..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.device_type} onValueChange={(value) => handleFilterChange("device_type", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="iOS">iOS</SelectItem>
                  <SelectItem value="Android">Android</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={searchUsers} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Subscription Tier</Label>
                    <Select
                      value={filters.subscription_tier}
                      onValueChange={(value) => handleFilterChange("subscription_tier", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Tiers</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>RFM Segment</Label>
                    <Select value={filters.rfm_score} onValueChange={(value) => handleFilterChange("rfm_score", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Segments</SelectItem>
                        <SelectItem value="444">Champions</SelectItem>
                        <SelectItem value="333">Loyal Customers</SelectItem>
                        <SelectItem value="311">Potential Loyalists</SelectItem>
                        <SelectItem value="211">At Risk</SelectItem>
                        <SelectItem value="111">Lost Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Signup Date Range</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="date"
                        onChange={(e) =>
                          handleFilterChange("date_range", {
                            start: e.target.value,
                            end: filters.date_range?.end || "",
                          })
                        }
                      />
                      <Input
                        type="date"
                        onChange={(e) =>
                          handleFilterChange("date_range", {
                            start: filters.date_range?.start || "",
                            end: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={searchUsers}>Apply Filters</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Found {users.length} users matching your criteria</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{users.length} results</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>RFM Segment</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.external_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">
                        {user.city}, {user.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {user.device_type === "iOS" || user.device_type === "Android" ? (
                        <Smartphone className="h-3 w-3 text-gray-400" />
                      ) : (
                        <Globe className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-sm">{user.device_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.custom_attributes?.subscription_tier || "Basic"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRFMColor(getRFMSegment(user.rfm_score || ""))}>
                      {getRFMSegment(user.rfm_score || "")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">
                        {user.last_seen ? new Date(user.last_seen).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${user.total_spent.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{user.total_orders} orders</div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} open={!!selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

function UserDetailModal({ user, open, onClose }: { user: User; open: boolean; onClose: () => void }) {
  const [userEvents, setUserEvents] = useState<any[]>([])
  const [userSessions, setUserSessions] = useState<any[]>([])
  const [userCampaigns, setUserCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && user) {
      loadUserDetails()
    }
  }, [open, user])

  const loadUserDetails = async () => {
    setLoading(true)
    try {
      const [events, sessions, campaigns] = await Promise.all([
        usersApi.getUserEvents(user.id),
        usersApi.getUserSessions(user.id),
        usersApi.getUserCampaigns(user.id),
      ])

      setUserEvents(events.data || [])
      setUserSessions(sessions.data || [])
      setUserCampaigns(campaigns.data || [])
    } catch (error) {
      console.error("Error loading user details:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>
                {user.first_name} {user.last_name}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </DialogTitle>
          <DialogDescription>Complete user profile with activity timeline and engagement history</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{user.session_count}</div>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{user.total_orders}</div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">${user.total_spent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">${user.avg_order_value.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Avg Order Value</p>
                </CardContent>
              </Card>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {user.city}, {user.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Joined {user.signup_date ? new Date(user.signup_date).toLocaleDateString() : "Unknown"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                    <span>
                      {user.device_type} - {user.device_model}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span>OS: {user.os_version}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span>Push: {user.push_enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>Email: {user.email_subscribed ? "Subscribed" : "Unsubscribed"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest user activities and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading events...</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userEvents.map((event, index) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="font-mono text-xs">
                              {event.event_name}
                            </Badge>
                            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                          {Object.keys(event.event_properties).length > 0 && (
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                              {JSON.stringify(event.event_properties, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign History</CardTitle>
                <CardDescription>All campaigns sent to this user</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading campaigns...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userCampaigns.map((send) => (
                        <TableRow key={send.id}>
                          <TableCell>{send.campaigns?.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{send.campaigns?.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={send.status === "delivered" ? "default" : "secondary"}>{send.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(send.sent_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="font-medium">External ID:</span>
                    <span>{user.external_id}</span>
                    <span className="font-medium">Language:</span>
                    <span>{user.language || "Not set"}</span>
                    <span className="font-medium">Timezone:</span>
                    <span>{user.timezone || "Not set"}</span>
                    <span className="font-medium">RFM Score:</span>
                    <span>{user.rfm_score || "Not calculated"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Attributes</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(user.custom_attributes).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(user.custom_attributes).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No custom attributes set</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
