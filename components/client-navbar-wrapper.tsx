// // components/ClientNavbarWrapper.tsx
// "use client";

// import { usePathname } from "next/navigation";
// import { Navbar } from "@/components/navbar";

// interface User {
//   id: number;
//   email: string;
//   isAdmin: boolean;
// }

// interface ClientNavbarWrapperProps {
//   user: User | null; // Allow user to be null
// }

// export function ClientNavbarWrapper({ user }: ClientNavbarWrapperProps) {
//   const pathname = usePathname();
//   const hideNavbar = pathname === "/login" || pathname === "/signup"; // To hide the navbar in login page
//   console.log("ClientNavbarWrapper user:", user); // Debug log
//   return !hideNavbar ? <Navbar user={user} /> : null;
// }

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

interface ClientNavbarWrapperProps {
  user: User | null;
}

export function ClientNavbarWrapper({ user }: ClientNavbarWrapperProps) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password"); // covers token query param

  return !hideNavbar ? <Navbar user={user} /> : null;
}
