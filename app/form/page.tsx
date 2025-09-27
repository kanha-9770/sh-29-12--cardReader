import { getSession } from "@/lib/auth"
import { ExhibitionForm } from "@/components/exhibition-form"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect("/login")  // login
  }

  return (
    <>
      
      <main className="w-full bg-[#f3f1f8] py-20">
        <ExhibitionForm />
      </main>
    </>
  )
}
