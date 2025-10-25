// import { redirect } from "next/navigation"
// import { getSession } from "@/lib/auth"
// import { AdminDashboard } from "@/components/admin/dashboard"
// import { UserDashboard } from "@/components/admin/user-dashboard"
// import { Navbar } from "@/components/navbar"

// export default async function DashboardPage() {
//   const session = await getSession()

//   if (!session) {
//     redirect("/login")
//   }

//   return (
//     <>

//       <main className="container mx-auto lg:mt-16 py-6">

//         {session.isAdmin ? <AdminDashboard /> : <UserDashboard />}
//       </main>
//     </>
//   )
// }


import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/dashboard"
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
      <main className="container mx-auto lg:mt-16 py-6 fade-in-up">
        <div className="fade-in-up">
          {session.isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </main>
    </>
  )
}
