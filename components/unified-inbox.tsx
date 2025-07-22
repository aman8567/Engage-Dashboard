"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, MessageSquare, Phone, Search, Reply, Forward, Archive, Star, Tag, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { inboxApi } from "@/lib/advanced-api"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: Phone,
  phone: Phone,
  social: MessageSquare,
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  normal: "bg-blue-100 text-blue-800",
  low: "bg-gray-100 text-gray-800",
}

const statusColors = {
  unread: "bg-green-100 text-green-800",
  read: "bg-blue-100 text-blue-800",
  replied: "bg-purple-100 text-purple-800",
  archived: "bg-gray-100 text-gray-800",
}

export function UnifiedInbox() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [filters, setFilters] = useState({
    status: "all",
    channel: "all",
    priority: "all",
    search: "",
  })
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [filters])

  const loadMessages = async () => {
    try {
      const data = await inboxApi.getMessages(filters)
      setMessages(data)
    } catch (error) {
      console.error("Failed to load messages:", error)
      toast.error("Failed to load messages")
    }
  }

  const handleStatusUpdate = async (messageId: string, status: string) => {
    try {
      await inboxApi.updateMessage(messageId, { status })
      await loadMessages()
      toast.success("Message status updated")
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update message status")
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return

    setLoading(true)
    try {
      await inboxApi.sendReply(selectedMessage.id, replyContent)
      await handleStatusUpdate(selectedMessage.id, "replied")
      setReplyContent("")
      toast.success("Reply sent successfully")
    } catch (error) {
      console.error("Failed to send reply:", error)
      toast.error("Failed to send reply")
    } finally {
      setLoading(false)
    }
  }

  const getChannelIcon = (channel: string) => {
    const Icon = channelIcons[channel] || MessageSquare
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar - Message List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Unified Inbox</h2>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="overflow-y-auto h-full">
          {messages.map((message: any) => (
            <div
              key={message.id}
              className={cn(
                "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                selectedMessage?.id === message.id && "bg-blue-50 border-blue-200",
              )}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.contacts?.first_name?.[0]}
                      {message.contacts?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {message.contacts?.first_name} {message.contacts?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{message.contacts?.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getChannelIcon(message.channel)}
                  <Badge className={cn("text-xs", priorityColors[message.priority])}>{message.priority}</Badge>
                </div>
              </div>

              <div className="mb-2">
                {message.subject && <p className="font-medium text-sm mb-1">{message.subject}</p>}
                <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={cn("text-xs", statusColors[message.status])}>{message.status}</Badge>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <>
            {/* Message Header */}
            <div className="p-6 border-b bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedMessage.contacts?.first_name?.[0]}
                      {selectedMessage.contacts?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedMessage.contacts?.first_name} {selectedMessage.contacts?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedMessage.contacts?.email}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.contacts?.company}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", statusColors[selectedMessage.status])}>
                    {selectedMessage.status}
                  </Badge>
                  <Badge className={cn("text-xs", priorityColors[selectedMessage.priority])}>
                    {selectedMessage.priority}
                  </Badge>
                  {getChannelIcon(selectedMessage.channel)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(selectedMessage.id, "read")}>
                  <Reply className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(selectedMessage.id, "archived")}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button size="sm" variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Star
                </Button>
                <Button size="sm" variant="outline">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reply Section */}
            <div className="p-6 border-t bg-gray-50">
              <div className="space-y-4">
                <Label>Reply to {selectedMessage.contacts?.first_name}</Label>
                <Textarea
                  placeholder="Type your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Tag className="h-4 w-4 mr-2" />
                      Add Tags
                    </Button>
                  </div>
                  <Button onClick={handleReply} disabled={loading || !replyContent.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No message selected</h3>
              <p className="text-gray-500">Choose a message from the list to view its details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
