"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BarChart, CheckCircle, Clock, Users, Shield, UserPlus, AlertTriangle, Layers } from "lucide-react"
import Link from "next/link"
import { getMockUsers, getMockPendingUsers } from "@/lib/services/mock-user-service"
import { getMockTeams } from "@/lib/services/mock-team-service"
import type { UserListItem } from "@/lib/schemas/user-types"
import type { ModerationTeam } from "@/lib/schemas/team-types"

interface AdminDashboardProps {
  userId: string
}

export function AdminDashboard({ userId }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [pendingUsers, setPendingUsers] = useState<UserListItem[]>([])
  const [teams, setTeams] = useState<ModerationTeam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, pendingUsersData, teamsData] = await Promise.all([
          getMockUsers(),
          getMockPendingUsers(),
          getMockTeams(),
        ])

        setUsers(usersData)
        setPendingUsers(pendingUsersData)
        setTeams(teamsData)
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return <div className="flex justify-center items-center h-[600px]">Loading admin dashboard...</div>
  }

  // Calculate statistics
  const totalUsers = users.length
  const totalAdmins = users.filter((user) => user.role === "admin").length
  const totalModerators = users.filter((user) => user.role === "moderator").length
  const totalPendingApprovals = pendingUsers.length
  const totalTeams = teams.length

  // Get recent users (last 5)
  const recentUsers = [...users]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
          <div className="absolute inset-0 h-1 bg-gradient-blue-purple"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {totalAdmins} Admins, {totalModerators} Moderators
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
          <div className="absolute inset-0 h-1 bg-gradient-orange-red"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting admin review</p>
          </CardContent>
        </Card>

        <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
          <div className="absolute inset-0 h-1 bg-gradient-green-blue"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderation Teams</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Layers className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">Active moderation teams</p>
          </CardContent>
        </Card>

        <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
          <div className="absolute inset-0 h-1 bg-gradient-purple-pink"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Recently registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "moderator" ? "outline" : "secondary"}
                      className={
                        user.role === "admin"
                          ? "bg-blue-500"
                          : user.role === "moderator"
                            ? "border-green-500 text-green-500"
                            : "bg-orange-500"
                      }
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      variant={user.approved ? "outline" : "secondary"}
                      className={user.approved ? "border-green-500 text-green-500" : "bg-red-500"}
                    >
                      {user.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/admin/users">View All Users</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/dashboard/admin/approvals">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Review Pending Approvals
                  {totalPendingApprovals > 0 && <Badge className="ml-auto bg-red-500">{totalPendingApprovals}</Badge>}
                </Button>
              </Link>

              <Link href="/dashboard/admin/teams">
                <Button className="w-full justify-start" variant="outline">
                  <Layers className="mr-2 h-4 w-4" />
                  Manage Moderation Teams
                </Button>
              </Link>

              <Link href="/dashboard/admin/users">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>

              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View System Logs
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Admin Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>Moderation Teams</CardTitle>
            <CardDescription>Active moderation teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams.slice(0, 3).map((team) => (
                <div
                  key={team.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{team.name}</h3>
                    <Badge variant="outline">{team.members.length} Members</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {team.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/admin/teams">View All Teams</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>API Services</span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Database</span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Authentication</span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span>AI Moderation</span>
                </div>
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  Degraded
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Storage</span>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Operational
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

