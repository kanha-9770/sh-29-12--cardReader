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
      <main className="flex justify-center items-center bg-gradient-to-br from-background via-muted to-background">
        <SubmissionPage />
      </main>
    </>
  );
}
