// "use client"

// import { usePathname } from 'next/navigation'
// import { Footer } from '@/components/footer'

// export function ClientFooterWrapper({ user }: { user: any }) {
//   const pathname = usePathname()
//   const hideFooter = pathname === '/login' // To hide the footer in login page
//   return !hideFooter ? <Footer /> : null
// }


"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

export function ClientFooterWrapper({ user }: { user: any }) {
  const pathname = usePathname();

  // pages where footer should be hidden
  const hiddenRoutes = ["/signup","/login", "/forgot-password", "/reset-password"];

  // match pages starting with "/reset-password"
  const hideFooter = hiddenRoutes.some(route =>
    pathname.startsWith(route)
  );

  return !hideFooter ? <Footer /> : null;
}
