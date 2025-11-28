import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminDashboardEnhanced } from "@/components/admin/dashboard"
import { UserDashboard } from "@/components/admin/user-dashboard"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }
      `}</style>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/30 mx-auto fade-in-up overflow-hidden transition-colors duration-500">
        <div className="fade-in-up">
          {session.isAdmin ? <AdminDashboardEnhanced /> : <UserDashboard />}
        </div>
      </main>
    </>
  )
}