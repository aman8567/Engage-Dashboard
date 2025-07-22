"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Download, Pause, Zap, Clock, User, Globe, Code, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const realtimeEvents = [
  {
    id: 1,
    eventName: "purchase_completed",
    userId: "user_12345",
    timestamp: "2024-01-15 14:32:15",
    properties: {
      amount: 99.99,
      currency: "USD",
      product_id: "prod_123",
      category: "electronics",
    },
    location: "New York, US",
    device: "iPhone 15",
  },
  {
    id: 2,
    eventName: "page_view",
    userId: "user_67890",
    timestamp: "2024-01-15 14:32:12",
    properties: {
      page_url: "/products/smartphone",
      referrer: "google.com",
      session_id: "sess_abc123",
    },
    location: "London, UK",
    device: "Chrome Desktop",
  },
  {
    id: 3,
    eventName: "button_click",
    userId: "user_54321",
    timestamp: "2024-01-15 14:32:10",
    properties: {
      button_text: "Add to Cart",
      page_url: "/products/laptop",
      element_id: "add-to-cart-btn",
    },
    location: "Toronto, CA",
    device: "Safari Mobile",
  },
  {
    id: 4,
    eventName: "form_submit",
    userId: "user_98765",
    timestamp: "2024-01-15 14:32:08",
    properties: {
      form_name: "newsletter_signup",
      email: "user@example.com",
      source: "homepage",
    },
    location: "Sydney, AU",
    device: "Chrome Desktop",
  },
]

const customEvents = [
  {
    id: 1,
    name: "purchase_completed",
    description: "Triggered when a user completes a purchase",
    properties: ["amount", "currency", "product_id", "category"],
    status: "Active",
    lastTriggered: "2 minutes ago",
    totalTriggers: 12450,
  },
  {
    id: 2,
    name: "cart_abandoned",
    description: "Triggered when a user leaves items in cart for 30 minutes",
    properties: ["cart_value", "items_count", "last_item_added"],
    status: "Active",
    lastTriggered: "5 minutes ago",
    totalTriggers: 3421,
  },
  {
    id: 3,
    name: "video_watched",
    description: "Triggered when a user watches a video for more than 50%",
    properties: ["video_id", "duration", "completion_rate"],
    status: "Draft",
    lastTriggered: "Never",
    totalTriggers: 0,
  },
]

export function EventsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Track and manage custom events across your application</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Events
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Custom Event</DialogTitle>
                <DialogDescription>Define a new custom event to track user interactions</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input id="event-name" placeholder="e.g., button_clicked" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe when this event should be triggered" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="properties">Properties (JSON)</Label>
                  <Textarea
                    id="properties"
                    placeholder='{"property1": "string", "property2": "number"}'
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Feed</TabsTrigger>
          <TabsTrigger value="custom">Custom Events</TabsTrigger>
          <TabsTrigger value="analytics">Event Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search events, users, or properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="purchase">Purchase Events</SelectItem>
                    <SelectItem value="page_view">Page Views</SelectItem>
                    <SelectItem value="button_click">Button Clicks</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Events Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Event Stream
                </CardTitle>
                <CardDescription>Real-time events as they happen</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realtimeEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-mono">
                          {event.eventName}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          <User className="inline h-3 w-3 mr-1" />
                          {event.userId}
                        </span>
                        <span className="text-sm text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {event.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Globe className="h-3 w-3" />
                        <span>{event.location}</span>
                        <span>•</span>
                        <span>{event.device}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {JSON.stringify(event.properties, null, 2).substring(0, 100)}...
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Events</CardTitle>
              <CardDescription>Manage your custom event definitions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Total Triggers</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono font-medium">{event.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {event.properties.slice(0, 2).map((prop) => (
                            <Badge key={prop} variant="secondary" className="text-xs">
                              {prop}
                            </Badge>
                          ))}
                          {event.properties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{event.properties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.status === "Active" ? "default" : "secondary"}>{event.status}</Badge>
                      </TableCell>
                      <TableCell>{event.lastTriggered}</TableCell>
                      <TableCell>{event.totalTriggers.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events Today</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89,234</div>
                <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Events</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+3 new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,847</div>
                <p className="text-xs text-muted-foreground">+8.2% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Events/User</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.6</div>
                <p className="text-xs text-muted-foreground">+0.3 from yesterday</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
              <DialogDescription>Detailed information about this event occurrence</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Event Name</Label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedEvent.eventName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User ID</Label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedEvent.userId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded">{selectedEvent.timestamp}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm bg-gray-100 p-2 rounded">{selectedEvent.location}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Properties</Label>
                <pre className="text-sm bg-gray-100 p-3 rounded mt-1 overflow-auto">
                  {JSON.stringify(selectedEvent.properties, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
