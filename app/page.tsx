import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"

export default async function HomePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  } else {
    redirect("/dashboard")
  }
}

