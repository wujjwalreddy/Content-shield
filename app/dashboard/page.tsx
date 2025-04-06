import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentAlerts } from "@/components/recent-alerts"
import { ModeratorActivity } from "@/components/moderator-activity"
import { ContentStats } from "@/components/content-stats"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardHeader from "@/components/dashboard-header"
import { getServerSession } from "@/lib/auth"
import { getMockContentStats } from "@/lib/services/mock-data-service"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // In a real app, you would fetch this data from your database
  // For now, we'll use mock data
  const stats = await getMockContentStats(session.user.uid)

  // Extract only the serializable properties we need
  const userProps = {
    uid: session.user.uid,
    email: session.user.email,
    displayName: session.user.displayName,
    photoURL: session.user.photoURL,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={userProps} />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Content Moderation Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
            <div className="absolute inset-0 h-1 bg-gradient-blue-purple"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flagged Content</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M12 2v8m0 8v4m-8-8h4m8 0h4" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFlagged.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
            <div className="absolute inset-0 h-1 bg-gradient-orange-red"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-orange-500"
                >
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReview}</div>
              <p className="text-xs text-muted-foreground">Requires human review</p>
            </CardContent>
          </Card>
          <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
            <div className="absolute inset-0 h-1 bg-gradient-green-blue"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiAccuracy}%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="card-hover-effect bg-white dark:bg-gray-800 shadow-md border-none overflow-hidden">
            <div className="absolute inset-0 h-1 bg-gradient-purple-pink"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Human Overrides</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.humanOverrides}%</div>
              <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle>Content Moderation Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[400px]">
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <Overview />
              </Suspense>
            </CardContent>
          </Card>
          <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>High-priority content requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto">
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <RecentAlerts userId={session.user.uid} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle>Moderator Activity</CardTitle>
              <CardDescription>Recent actions taken by moderators</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto">
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <ModeratorActivity userId={session.user.uid} />
              </Suspense>
            </CardContent>
          </Card>
          <Card className="col-span-4 bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader className="pb-2">
              <CardTitle>Content Statistics</CardTitle>
              <CardDescription>Breakdown of harmful content by category</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 h-[400px]">
              <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                <ContentStats userId={session.user.uid} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

