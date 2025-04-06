"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flag, ThumbsDown, Twitter, Facebook, Instagram, Youtube } from "lucide-react"
import type { Alert } from "@/lib/schemas/content-types"
import { getMockRecentAlerts } from "@/lib/services/mock-data-service"

interface RecentAlertsProps {
  userId: string
}

// Platform icon component
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "twitter":
      return <Twitter className="h-4 w-4 text-[#1da1f2]" />
    case "facebook":
      return <Facebook className="h-4 w-4 text-[#4267B2]" />
    case "instagram":
      return <Instagram className="h-4 w-4 text-[#C13584]" />
    case "youtube":
      return <Youtube className="h-4 w-4 text-[#FF0000]" />
    case "reddit":
      return (
        <svg className="h-4 w-4 text-[#ff4500]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      )
    case "tiktok":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    default:
      return <div className="h-4 w-4 rounded-full bg-gray-500" />
  }
}

export function RecentAlerts({ userId }: RecentAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getMockRecentAlerts(userId)
        setAlerts(data)
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [userId])

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading alerts...</div>
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start space-x-4 rounded-md border p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={alert.avatar} alt={alert.username} />
            <AvatarFallback>{alert.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none flex items-center">
                <PlatformIcon platform={alert.platform} />
                <span className="ml-1">
                  {alert.platform} - @{alert.username}
                </span>
              </p>
              <div className="flex items-center space-x-1">
                <Badge
                  variant={
                    alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "outline"
                  }
                  className="ml-auto"
                >
                  {alert.severity}
                </Badge>
                <Badge
                  variant="outline"
                  className={`bg-${alert.category.toLowerCase().replace(" ", "")}-light text-${alert.category.toLowerCase().replace(" ", "")}`}
                >
                  {alert.category}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{alert.content}</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {typeof alert.timestamp === "string" ? alert.timestamp : alert.timestamp.toLocaleString()}
              </span>
              <div className="ml-auto flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                >
                  <Flag className="mr-1 h-3.5 w-3.5" />
                  Review
                </Button>
                <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
                  <ThumbsDown className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

