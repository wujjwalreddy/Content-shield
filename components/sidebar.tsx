"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Users,
  UserCog,
  UserPlus,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserRole } from "@/lib/schemas/user-types"

interface SidebarProps {
  user: {
    uid: string
    email?: string | null
    displayName?: string | null
    photoURL?: string | null
    role?: UserRole
    approved?: boolean
  }
}

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const isAdmin = user?.role === "admin"

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Content Review",
      href: "/dashboard/content",
      icon: MessageSquare,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Alerts",
      href: "/dashboard/alerts",
      icon: Bell,
    },
    {
      title: "Moderation Team",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  // Admin-only navigation items
  const adminItems = [
    {
      title: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: Shield,
    },
    {
      title: "User Management",
      href: "/dashboard/admin/users",
      icon: UserCog,
    },
    {
      title: "Team Management",
      href: "/dashboard/admin/teams",
      icon: Layers,
    },
    {
      title: "Pending Approvals",
      href: "/dashboard/admin/approvals",
      icon: UserPlus,
    },
  ]

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-gray-900 border-r shadow-sm transition-all duration-300",
        collapsed ? "sidebar-collapsed" : "sidebar",
      )}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed ? (
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">Content Shield</span>
            </div>
          ) : (
            <Shield className="h-6 w-6 text-primary mx-auto" />
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-item flex items-center py-3 px-3 rounded-md text-sm font-medium",
                (
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)
                )
                  ? "active text-primary"
                  : "text-muted-foreground hover:text-foreground",
                collapsed ? "justify-center" : "",
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className={cn("my-4 border-t pt-4", collapsed ? "mx-2" : "")}>
                {!collapsed && <h4 className="px-3 text-xs font-semibold text-muted-foreground mb-2">ADMIN</h4>}
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "sidebar-item flex items-center py-3 px-3 rounded-md text-sm font-medium",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "active text-primary"
                      : "text-muted-foreground hover:text-foreground",
                    collapsed ? "justify-center" : "",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3 space-y-1">
              <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground truncate max-w-[140px]">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

