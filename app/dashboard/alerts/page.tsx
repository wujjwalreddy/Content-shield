import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import { RecentAlerts } from "@/components/recent-alerts"
import { getServerSession } from "@/lib/auth"

export default async function AlertsPage() {
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

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={userProps} />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>High-priority content requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAlerts userId={session.user.uid} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

