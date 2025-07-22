"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, Eye, Edit, Trash2, Play, RefreshCw, Download, Target } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const segments = [
  {
    id: 1,
    name: "High Value Customers",
    description: "Users who have spent more than $500 in the last 6 months",
    type: "Dynamic",
    userCount: 2341,
    lastUpdated: "2 hours ago",
    status: "Active",
    criteria: [
      { field: "total_spent", operator: "greater_than", value: "500", timeframe: "6_months" },
      { field: "last_purchase", operator: "within", value: "30_days" },
    ],
  },
  {
    id: 2,
    name: "Cart Abandoners",
    description: "Users who added items to cart but didn't complete purchase",
    type: "Dynamic",
    userCount: 5678,
    lastUpdated: "1 hour ago",
    status: "Active",
    criteria: [
      { field: "cart_abandoned", operator: "equals", value: "true" },
      { field: "last_activity", operator: "within", value: "7_days" },
    ],
  },
  {
    id: 3,
    name: "Mobile Users - iOS",
    description: "Users who primarily use iOS devices",
    type: "Static",
    userCount: 12450,
    lastUpdated: "1 day ago",
    status: "Active",
    criteria: [
      { field: "device_type", operator: "equals", value: "iOS" },
      { field: "last_seen", operator: "within", value: "30_days" },
    ],
  },
  {
    id: 4,
    name: "New Users This Week",
    description: "Users who signed up in the last 7 days",
    type: "Dynamic",
    userCount: 892,
    lastUpdated: "30 minutes ago",
    status: "Active",
    criteria: [{ field: "signup_date", operator: "within", value: "7_days" }],
  },
]

const segmentPreview = {
  totalUsers: 2341,
  demographics: {
    age: { "18-24": 15, "25-34": 35, "35-44": 30, "45-54": 15, "55+": 5 },
    location: { US: 45, UK: 20, CA: 15, AU: 10, Others: 10 },
  },
  behavior: {
    avgSessionDuration: "4m 32s",
    avgOrderValue: "$127.50",
    purchaseFrequency: "2.3x/month",
  },
}

export function SegmentsView() {
  const [selectedSegment, setSelectedSegment] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [criteria, setCriteria] = useState([{ field: "", operator: "", value: "", timeframe: "" }])

  const addCriteria = () => {
    setCriteria([...criteria, { field: "", operator: "", value: "", timeframe: "" }])
  }

  const removeCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Segments</h1>
          <p className="text-gray-600 mt-1">Create and manage user segments for targeted campaigns</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Segments
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Segment</DialogTitle>
                <DialogDescription>
                  Define criteria to automatically group users based on their behavior and attributes
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="criteria">Criteria</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="segment-name">Segment Name</Label>
                      <Input id="segment-name" placeholder="e.g., High Value Customers" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Describe this segment" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Segment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dynamic">Dynamic (Auto-updating)</SelectItem>
                          <SelectItem value="static">Static (Fixed list)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="criteria" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Segment Criteria</Label>
                      <Button variant="outline" size="sm" onClick={addCriteria}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Criteria
                      </Button>
                    </div>

                    {criteria.map((criterion, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-3">
                          <Label className="text-xs">Field</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="total_spent">Total Spent</SelectItem>
                              <SelectItem value="last_purchase">Last Purchase</SelectItem>
                              <SelectItem value="signup_date">Signup Date</SelectItem>
                              <SelectItem value="device_type">Device Type</SelectItem>
                              <SelectItem value="location">Location</SelectItem>
                              <SelectItem value="age">Age</SelectItem>
                              <SelectItem value="cart_abandoned">Cart Abandoned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Operator</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="not_equals">Not Equals</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="within">Within</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Value</Label>
                          <Input placeholder="Enter value" />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Timeframe</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1_day">Last 24 hours</SelectItem>
                              <SelectItem value="7_days">Last 7 days</SelectItem>
                              <SelectItem value="30_days">Last 30 days</SelectItem>
                              <SelectItem value="6_months">Last 6 months</SelectItem>
                              <SelectItem value="1_year">Last year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1">
                          {criteria.length > 1 && (
                            <Button variant="outline" size="sm" onClick={() => removeCriteria(index)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {segmentPreview.totalUsers.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Users match this segment</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Demographics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs">
                            <div className="flex justify-between">
                              <span>Age 25-34:</span>
                              <span>35%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>US Users:</span>
                              <span>45%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Behavior</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs">
                            <div className="flex justify-between">
                              <span>Avg Order Value:</span>
                              <span>$127.50</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Purchase Frequency:</span>
                              <span>2.3x/month</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button>Create Segment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Segments Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 created this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">87.5% of total segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users Segmented</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">65% of total users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Segment Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,885</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Segments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Segments</CardTitle>
          <CardDescription>Manage and monitor your user segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Input placeholder="Search segments..." />
            </div>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dynamic">Dynamic</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User Count</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{segment.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{segment.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={segment.type === "Dynamic" ? "default" : "secondary"}>{segment.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{segment.userCount.toLocaleString()}</TableCell>
                  <TableCell>{segment.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge variant={segment.status === "Active" ? "default" : "secondary"}>{segment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedSegment(segment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <Dialog open={!!selectedSegment} onOpenChange={() => setSelectedSegment(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedSegment.name}</DialogTitle>
              <DialogDescription>{selectedSegment.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedSegment.userCount.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedSegment.type}</div>
                  <p className="text-sm text-gray-600">Segment Type</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedSegment.status}</div>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Segment Criteria</h4>
                <div className="space-y-2">
                  {selectedSegment.criteria.map((criterion: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                      <code>
                        {criterion.field} {criterion.operator} {criterion.value}
                        {criterion.timeframe && ` (${criterion.timeframe.replace("_", " ")})`}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Count
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Users
                </Button>
                <Button>
                  <Play className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
