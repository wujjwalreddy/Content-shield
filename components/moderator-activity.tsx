"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, AlertCircle, Eye } from "lucide-react"
import type { ModeratorActivity as ModeratorActivityType } from "@/lib/schemas/content-types"
import { getMockModeratorActivity } from "@/lib/services/mock-data-service"

interface ModeratorActivityProps {
  userId: string
}

export function ModeratorActivity({ userId }: ModeratorActivityProps) {
  const [activities, setActivities] = useState<ModeratorActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getMockModeratorActivity(userId)
        setActivities(data)
      } catch (error) {
        console.error("Error fetching moderator activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId])

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading activities...</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-4 rounded-md border p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.avatar} alt={activity.moderator} />
            <AvatarFallback>{activity.moderator.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center">
              <p className="text-sm font-medium">{activity.moderator}</p>
              <Badge
                variant={
                  activity.action === "Removed"
                    ? "destructive"
                    : activity.action === "Approved"
                      ? "success"
                      : activity.action === "Warned"
                        ? "warning"
                        : activity.action === "Escalated"
                          ? "outline"
                          : "secondary"
                }
                className="ml-2"
              >
                {activity.action === "Removed" && <X className="mr-1 h-3 w-3" />}
                {activity.action === "Approved" && <Check className="mr-1 h-3 w-3" />}
                {activity.action === "Warned" && <AlertCircle className="mr-1 h-3 w-3" />}
                {activity.action === "Escalated" && <AlertCircle className="mr-1 h-3 w-3" />}
                {activity.action === "Reviewed" && <Eye className="mr-1 h-3 w-3" />}
                {activity.action}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {activity.content} •{" "}
              {typeof activity.timestamp === "string" ? activity.timestamp : activity.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

