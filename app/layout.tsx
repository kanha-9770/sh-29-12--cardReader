import type { Metadata } from "next";
import "./globals.css";
import { ClientNavbarWrapper } from "@/components/client-navbar-wrapper";
import { getSession } from "@/lib/auth";
import { ClientFooterWrapper } from "@/components/client-footer-wrapper";
import { Toaster } from "sonner"; // ✅ ADD THIS

// ✅ Required to force cookie re-evaluation
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Nessco Card Reader",
  description: "Created with nessco by akash",
};

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user: User | null = session;

  return (
    <html lang="en">
      <body>
        {/* ✅ TOASTER MUST BE INSIDE BODY */}
        <Toaster position="top-right" richColors closeButton />

        <ClientNavbarWrapper user={user} />
        
        {children}
        
        <ClientFooterWrapper user={user} />
      </body>
    </html>
  );
}
