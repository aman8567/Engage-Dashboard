"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  Home,
  Target,
  Inbox,
  UserCheck,
  Zap,
  TrendingUp,
  Shield,
  Smartphone,
  Globe,
  Plus,
  ChevronDown,
} from "lucide-react"

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Inbox", href: "/inbox", icon: Inbox, badge: "3" },
    ],
  },
  {
    title: "Campaigns",
    items: [
      { name: "All Campaigns", href: "/campaigns", icon: Target },
      { name: "Create Campaign", href: "/campaigns/builder", icon: Plus },
      { name: "Templates", href: "/templates", icon: Calendar },
      { name: "A/B Tests", href: "/ab-tests", icon: Zap },
    ],
  },
  {
    title: "Audience",
    items: [
      { name: "Users", href: "/users", icon: Users },
      { name: "Segments", href: "/segments", icon: UserCheck },
      { name: "Events", href: "/events", icon: TrendingUp },
      { name: "Journeys", href: "/journeys", icon: Globe },
    ],
  },
  {
    title: "Channels",
    items: [
      { name: "Email", href: "/channels/email", icon: MessageSquare },
      { name: "SMS", href: "/channels/sms", icon: Smartphone },
      { name: "Push", href: "/channels/push", icon: Bell },
      { name: "WhatsApp", href: "/channels/whatsapp", icon: MessageSquare },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "Account", href: "/settings", icon: Settings },
      { name: "Team", href: "/settings/team", icon: Users },
      { name: "Integrations", href: "/settings/integrations", icon: Zap },
      { name: "Security", href: "/settings/security", icon: Shield },
    ],
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Target className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">MoEngage Clone</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                    <ChevronDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <Target className="size-4 shrink-0" />
                    </div>
                    MoEngage Clone
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <Plus className="size-4 shrink-0" />
                    </div>
                    Add workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <User className="size-8 rounded-lg" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs">john@company.com</span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <User className="size-8 rounded-lg" />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">John Doe</span>
                        <span className="truncate text-xs">john@company.com</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <div className="flex flex-1 items-center gap-2 text-sm">
              <span className="font-semibold">MoEngage Clone</span>
            </div>
          </div>
          <div className="ml-auto px-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-64 pl-8" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
