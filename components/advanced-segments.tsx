"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Users, Eye, Edit, Trash2, Play, RefreshCw, Download, Target, Filter } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { segmentsApi } from "@/lib/api"
import type { Segment } from "@/lib/supabase"

interface SegmentCriteria {
  field: string
  operator: string
  value: string
  timeframe?: string
  logic?: "AND" | "OR"
}

const FIELD_OPTIONS = [
  { value: "email", label: "Email", type: "string" },
  { value: "first_name", label: "First Name", type: "string" },
  { value: "last_name", label: "Last Name", type: "string" },
  { value: "country", label: "Country", type: "string" },
  { value: "city", label: "City", type: "string" },
  { value: "device_type", label: "Device Type", type: "string" },
  { value: "device_model", label: "Device Model", type: "string" },
  { value: "os_version", label: "OS Version", type: "string" },
  { value: "app_version", label: "App Version", type: "string" },
  { value: "signup_date", label: "Signup Date", type: "date" },
  { value: "last_seen", label: "Last Seen", type: "date" },
  { value: "session_count", label: "Session Count", type: "number" },
  { value: "total_orders", label: "Total Orders", type: "number" },
  { value: "total_spent", label: "Total Spent", type: "number" },
  { value: "avg_order_value", label: "Avg Order Value", type: "number" },
  { value: "last_purchase_date", label: "Last Purchase Date", type: "date" },
  { value: "rfm_recency", label: "RFM Recency", type: "number" },
  { value: "rfm_frequency", label: "RFM Frequency", type: "number" },
  { value: "rfm_monetary", label: "RFM Monetary", type: "number" },
  { value: "rfm_score", label: "RFM Score", type: "string" },
  { value: "push_enabled", label: "Push Enabled", type: "boolean" },
  { value: "email_subscribed", label: "Email Subscribed", type: "boolean" },
  { value: "sms_subscribed", label: "SMS Subscribed", type: "boolean" },
  { value: "custom_attributes.subscription_tier", label: "Subscription Tier", type: "string" },
  { value: "custom_attributes.favorite_category", label: "Favorite Category", type: "string" },
  { value: "events.purchase_completed", label: "Purchase Completed Event", type: "event" },
  { value: "events.cart_abandoned", label: "Cart Abandoned Event", type: "event" },
  { value: "events.page_view", label: "Page View Event", type: "event" },
  { value: "events.button_click", label: "Button Click Event", type: "event" },
]

const OPERATOR_OPTIONS = {
  string: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does Not Contain" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
    { value: "in", label: "In List" },
    { value: "not_in", label: "Not In List" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "greater_than", label: "Greater Than" },
    { value: "greater_than_or_equal", label: "Greater Than or Equal" },
    { value: "less_than", label: "Less Than" },
    { value: "less_than_or_equal", label: "Less Than or Equal" },
    { value: "between", label: "Between" },
  ],
  date: [
    { value: "equals", label: "On Date" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "between", label: "Between" },
    { value: "within_last", label: "Within Last" },
    { value: "more_than_ago", label: "More Than Ago" },
  ],
  boolean: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is Not" },
  ],
  event: [
    { value: "performed", label: "Performed" },
    { value: "not_performed", label: "Not Performed" },
    { value: "performed_count", label: "Performed Count" },
  ],
}

const TIMEFRAME_OPTIONS = [
  { value: "1_hour", label: "Last 1 Hour" },
  { value: "24_hours", label: "Last 24 Hours" },
  { value: "7_days", label: "Last 7 Days" },
  { value: "30_days", label: "Last 30 Days" },
  { value: "90_days", label: "Last 90 Days" },
  { value: "6_months", label: "Last 6 Months" },
  { value: "1_year", label: "Last 1 Year" },
]

export function AdvancedSegments() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [previewCount, setPreviewCount] = useState<number>(0)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "dynamic" as "dynamic" | "static",
    criteria: [] as SegmentCriteria[],
  })

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    setLoading(true)
    try {
      const { data, error } = await segmentsApi.getAll()
      if (error) throw error
      setSegments(data || [])
    } catch (error) {
      console.error("Error loading segments:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, { field: "", operator: "", value: "", logic: "AND" }],
    }))
  }

  const removeCriteria = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }))
  }

  const updateCriteria = (index: number, updates: Partial<SegmentCriteria>) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.map((criterion, i) => (i === index ? { ...criterion, ...updates } : criterion)),
    }))
  }

  const previewSegment = async () => {
    try {
      const { count } = await segmentsApi.previewSegment({ conditions: formData.criteria })
      setPreviewCount(count)
    } catch (error) {
      console.error("Error previewing segment:", error)
    }
  }

  const createSegment = async () => {
    try {
      const { data, error } = await segmentsApi.create({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        criteria: { conditions: formData.criteria },
        user_count: previewCount,
        status: "active",
      })

      if (error) throw error

      setSegments((prev) => [data, ...prev])
      setIsCreating(false)
      setFormData({ name: "", description: "", type: "dynamic", criteria: [] })
      setPreviewCount(0)
    } catch (error) {
      console.error("Error creating segment:", error)
    }
  }

  const getFieldType = (field: string) => {
    const fieldOption = FIELD_OPTIONS.find((option) => option.value === field)
    return fieldOption?.type || "string"
  }

  const getOperatorOptions = (fieldType: string) => {
    return OPERATOR_OPTIONS[fieldType as keyof typeof OPERATOR_OPTIONS] || OPERATOR_OPTIONS.string
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Segments</h1>
          <p className="text-gray-600 mt-1">Create sophisticated user segments with complex criteria</p>
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
                Create Advanced Segment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Advanced Segment</DialogTitle>
                <DialogDescription>Build complex user segments with multiple criteria and conditions</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="criteria">Advanced Criteria</TabsTrigger>
                  <TabsTrigger value="preview">Preview & Test</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="segment-name">Segment Name</Label>
                      <Input
                        id="segment-name"
                        placeholder="e.g., High Value Mobile Users"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe this segment and its purpose"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Segment Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "dynamic" | "static") =>
                          setFormData((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                        Add Condition
                      </Button>
                    </div>

                    {formData.criteria.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No criteria added yet. Click "Add Condition" to start building your segment.
                      </div>
                    )}

                    {formData.criteria.map((criterion, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        {index > 0 && (
                          <div className="flex items-center space-x-2">
                            <Select
                              value={criterion.logic}
                              onValueChange={(value: "AND" | "OR") => updateCriteria(index, { logic: value })}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-500">this condition</span>
                          </div>
                        )}

                        <div className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-4">
                            <Label className="text-xs">Field</Label>
                            <Select
                              value={criterion.field}
                              onValueChange={(value) =>
                                updateCriteria(index, { field: value, operator: "", value: "" })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label className="text-xs">Operator</Label>
                            <Select
                              value={criterion.operator}
                              onValueChange={(value) => updateCriteria(index, { operator: value })}
                              disabled={!criterion.field}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {getOperatorOptions(getFieldType(criterion.field)).map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-3">
                            <Label className="text-xs">Value</Label>
                            {getFieldType(criterion.field) === "boolean" ? (
                              <Select
                                value={criterion.value}
                                onValueChange={(value) => updateCriteria(index, { value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">True</SelectItem>
                                  <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                placeholder="Enter value"
                                value={criterion.value}
                                onChange={(e) => updateCriteria(index, { value: e.target.value })}
                              />
                            )}
                          </div>

                          {(getFieldType(criterion.field) === "date" || getFieldType(criterion.field) === "event") && (
                            <div className="col-span-2">
                              <Label className="text-xs">Timeframe</Label>
                              <Select
                                value={criterion.timeframe}
                                onValueChange={(value) => updateCriteria(index, { timeframe: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIMEFRAME_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="col-span-1">
                            {formData.criteria.length > 1 && (
                              <Button variant="outline" size="sm" onClick={() => removeCriteria(index)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Segment Preview</h3>
                      <Button onClick={previewSegment} disabled={formData.criteria.length === 0}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Calculate Size
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">{previewCount.toLocaleString()}</div>
                          <p className="text-sm text-gray-600 mt-1">Users match this segment</p>
                        </div>
                      </CardContent>
                    </Card>

                    {formData.criteria.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Criteria Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {formData.criteria.map((criterion, index) => (
                              <div key={index} className="text-sm">
                                {index > 0 && <span className="font-medium text-blue-600 mr-2">{criterion.logic}</span>}
                                <code className="bg-gray-100 px-2 py-1 rounded">
                                  {FIELD_OPTIONS.find((f) => f.value === criterion.field)?.label}{" "}
                                  {
                                    getOperatorOptions(getFieldType(criterion.field)).find(
                                      (o) => o.value === criterion.operator,
                                    )?.label
                                  }{" "}
                                  {criterion.value}
                                  {criterion.timeframe &&
                                    ` (${TIMEFRAME_OPTIONS.find((t) => t.value === criterion.timeframe)?.label})`}
                                </code>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={createSegment} disabled={!formData.name || formData.criteria.length === 0}>
                  Create Segment
                </Button>
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
            <div className="text-2xl font-bold">{segments.length}</div>
            <p className="text-xs text-muted-foreground">
              {segments.filter((s) => s.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dynamic Segments</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segments.filter((s) => s.type === "dynamic").length}</div>
            <p className="text-xs text-muted-foreground">Auto-updating segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users Segmented</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {segments.reduce((sum, segment) => sum + segment.user_count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all segments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Segment Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {segments.length > 0
                ? Math.round(
                    segments.reduce((sum, segment) => sum + segment.user_count, 0) / segments.length,
                  ).toLocaleString()
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Average users per segment</p>
          </CardContent>
        </Card>
      </div>

      {/* Segments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Segments</CardTitle>
          <CardDescription>Manage and monitor your advanced user segments</CardDescription>
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Criteria Count</TableHead>
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
                    <Badge variant={segment.type === "dynamic" ? "default" : "secondary"}>{segment.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{segment.criteria?.conditions?.length || 0} conditions</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{segment.user_count.toLocaleString()}</TableCell>
                  <TableCell>{new Date(segment.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={segment.status === "active" ? "default" : "secondary"}>{segment.status}</Badge>
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
    </div>
  )
}
