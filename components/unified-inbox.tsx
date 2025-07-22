"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Users,
  Clock,
  AlertCircle,
  Send,
  Archive,
  Star,
  Search,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { inboxApi, teamApi, type InboxMessage } from "@/lib/advanced-api"

const CHANNEL_ICONS = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: Phone,
  phone: Phone,
  social: Users,
  push: Smartphone,
}

const STATUS_COLORS = {
  unread: "destructive",
  read: "secondary",
  replied: "default",
  archived: "outline",
}

const PRIORITY_COLORS = {
  low: "outline",
  normal: "secondary",
  high: "default",
  urgent: "destructive",
}

export function UnifiedInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    channel: "all",
    priority: "all",
    assigned: "all",
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [messagesData, teamData] = await Promise.all([
        inboxApi.getAll(filters.status !== "all" ? { status: filters.status } : {}),
        teamApi.getAll(),
      ])

      setMessages(messagesData.data || [])
      setTeamMembers(teamData.data || [])
    } catch (error) {
      console.error("Failed to load inbox data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (messageId: string, status: string) => {
    try {
      await inboxApi.updateStatus(messageId, status)
      loadData()
    } catch (error) {
      console.error("Failed to update message status:", error)
    }
  }

  const handleAssignMessage = async (messageId: string, assignedTo: string) => {
    try {
      await inboxApi.assignMessage(messageId, assignedTo)
      loadData()
    } catch (error) {
      console.error("Failed to assign message:", error)
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return

    try {
      await inboxApi.reply(selectedMessage.id, replyContent)
      setReplyContent("")
      setSelectedMessage(null)
      loadData()
      alert("Reply sent successfully!")
    } catch (error) {
      console.error("Failed to send reply:", error)
      alert("Failed to send reply")
    }
  }

  const getChannelIcon = (channelType: string) => {
    return CHANNEL_ICONS[channelType as keyof typeof CHANNEL_ICONS] || MessageSquare
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  const getUnreadCount = () => messages.filter((m) => m.status === "unread").length
  const getHighPriorityCount = () => messages.filter((m) => m.priority === "high" || m.priority === "urgent").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unified Inbox</h1>
          <p className="text-gray-600 mt-1">Manage all customer communications in one place</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="destructive">{getUnreadCount()} Unread</Badge>
          <Badge variant="default">{getHighPriorityCount()} High Priority</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">All channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUnreadCount()}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getHighPriorityCount()}</div>
            <p className="text-xs text-muted-foreground">Urgent responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>All customer communications across channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-8" />
              </div>
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.channel}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, channel: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Subject/Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => {
                const ChannelIcon = getChannelIcon(message.channel_type)

                return (
                  <TableRow key={message.id} className={message.status === "unread" ? "bg-blue-50" : ""}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {message.contacts?.first_name} {message.contacts?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {message.contacts?.email || message.contacts?.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ChannelIcon className="h-4 w-4 text-gray-500" />
                        <span className="capitalize">{message.channel_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {message.subject && <div className="font-medium text-sm">{message.subject}</div>}
                        <div className="text-sm text-gray-600 truncate max-w-xs">{message.content}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[message.status as keyof typeof STATUS_COLORS] as any}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={PRIORITY_COLORS[message.priority as keyof typeof PRIORITY_COLORS] as any}>
                        {message.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {message.team_members ? (
                        <span className="text-sm">
                          {message.team_members.first_name} {message.team_members.last_name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{formatDate(message.created_at)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(message)}>
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(message.id, message.status === "unread" ? "read" : "unread")
                          }
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(message.id, "archived")}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Message Detail/Reply Modal */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {React.createElement(getChannelIcon(selectedMessage.channel_type), { className: "h-5 w-5" })}
                <span>
                  {selectedMessage.contacts?.first_name} {selectedMessage.contacts?.last_name}
                </span>
              </DialogTitle>
              <DialogDescription>
                {selectedMessage.contacts?.email} • {selectedMessage.contacts?.company}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Original Message:</Label>
                <div className="bg-gray-50 p-3 rounded mt-1">
                  {selectedMessage.subject && <div className="font-medium mb-2">{selectedMessage.subject}</div>}
                  <div className="text-sm whitespace-pre-wrap">{selectedMessage.content}</div>
                </div>
              </div>

              <div>
                <Label htmlFor="reply">Your Reply:</Label>
                <Textarea
                  id="reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label>Assign to:</Label>
                  <Select
                    value={selectedMessage.assigned_to || ""}
                    onValueChange={(value) => handleAssignMessage(selectedMessage.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member: any) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority:</Label>
                  <Select defaultValue={selectedMessage.priority}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Cancel
              </Button>
              <Button onClick={handleReply} disabled={!replyContent.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
