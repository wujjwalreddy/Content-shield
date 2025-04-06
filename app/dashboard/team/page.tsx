import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import { getServerSession } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function TeamPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Extract only the serializable properties we need
  const userProps = {
    uid: session.user.uid,
    email: session.user.email,
    displayName: session.user.displayName,
    photoURL: session.user.photoURL,
  }

  // Mock team data
  const team = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Lead Moderator",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
      lastActive: "Just now",
    },
    {
      id: "2",
      name: "Sam Wilson",
      role: "Senior Moderator",
      email: "sam@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
      lastActive: "5 minutes ago",
    },
    {
      id: "3",
      name: "Jamie Smith",
      role: "Moderator",
      email: "jamie@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Away",
      lastActive: "1 hour ago",
    },
    {
      id: "4",
      name: "Taylor Reed",
      role: "Moderator",
      email: "taylor@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Offline",
      lastActive: "2 days ago",
    },
    {
      id: "5",
      name: "Morgan Chen",
      role: "Junior Moderator",
      email: "morgan@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
      lastActive: "30 minutes ago",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={userProps} />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Moderation Team</h2>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your content moderation team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm">{member.email}</p>
                      <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                    </div>
                    <Badge
                      variant={
                        member.status === "Active" ? "default" : member.status === "Away" ? "outline" : "secondary"
                      }
                      className={
                        member.status === "Active"
                          ? "bg-green-500"
                          : member.status === "Away"
                            ? "border-yellow-500 text-yellow-500"
                            : ""
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

