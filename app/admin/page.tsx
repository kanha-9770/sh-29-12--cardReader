import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/dashboard"
import { UserDashboard } from "@/components/admin/user-dashboard"
import { Navbar } from "@/components/navbar"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <>

      <main className="container mx-auto lg:mt-16 py-6">

        {session.isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </main>
    </>
  )
}

