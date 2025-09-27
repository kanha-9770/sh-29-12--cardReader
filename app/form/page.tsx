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
      
      <main className="container mt-5 py-10 bg-white">
        <ExhibitionForm />
      </main>
    </>
  )
}
