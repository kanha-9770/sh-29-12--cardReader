import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import SubmissionPage from "@/components/user/userData";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.isAdmin) {
    redirect("/");
  }

  return (
    <>
      <Navbar user={session} />
      <main className="container py-10 mt-20 lg:pl-20 flex justify-center items-center">
        <SubmissionPage />
      </main>
    </>
  );
}
