import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import { getServerSession, checkUserRole } from "@/lib/auth"
import { UserManagement } from "@/components/user-management"

export default async function UserManagementPage() {
  const session = await getServerSession()
  const isAdmin = await checkUserRole("admin")

  if (!session) {
    redirect("/login")
  }

  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Extract only the serializable properties we need
  const userProps = {
    uid: session.user.uid,
    email: session.user.email,
    displayName: session.user.displayName,
    photoURL: session.user.photoURL,
    role: session.user.role,
    approved: session.user.approved,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={userProps} />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>View, edit, and manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagement adminId={session.user.uid} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

