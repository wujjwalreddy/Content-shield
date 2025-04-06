import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { getServerSession } from "@/lib/auth"

export default async function AnalyticsPage() {
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
        <AnalyticsDashboard userId={session.user.uid} />
      </div>
    </div>
  )
}

