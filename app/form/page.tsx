import { getSession } from "@/lib/auth"
import { ExhibitionForm } from "@/components/exhibition-form"
import { redirect } from "next/navigation"

export default async function Home() {
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
      <main className="w-full min-h-screen bg-[#f3f1f8] dark:bg-gray-900 fade-in-up">
        <div className="fade-in-up">
          <ExhibitionForm />
        </div>
      </main>
    </>
  )
}