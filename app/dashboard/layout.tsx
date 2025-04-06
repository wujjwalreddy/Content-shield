import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <div className="flex h-screen">
      <Sidebar user={userProps} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        {children}
      </main>
    </div>
  )
}

