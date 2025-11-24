// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { useState } from "react";
// import { Menu, X, RotateCw, PlusCircle } from "lucide-react";

// // Define the User interface to match the expected JWT payload
// interface User {
//   id: number;
//   email: string;
//   isAdmin: boolean;
// }

// interface NavbarProps {
//   user: User | null;
// }

// export function Navbar({ user }: NavbarProps) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       toast({
//         title: "Logged out successfully",
//         description: "You have been logged out of your account.",
//       });
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast({
//         title: "Logout failed",
//         description: "An error occurred while logging out. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <nav className="border-b border-[#e5e2f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
//         <div className="flex items-center space-x-2 w-full sm:w-auto mb-2 sm:mb-0">
//           <Link
//             href="/"
//             className="flex items-center gap-2"
//             onClick={() => setIsOpen(false)}
//           >
//             <p className="font-semibold text-xl text-[#2d2a4a] leading-tight">
//               CardSync
//               <span className="block text-sm text-[#483d73] font-medium">
//                 With AI
//               </span>
//             </p>
//           </Link>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden sm:flex items-center space-x-4">
//           <Link
//             href="/"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Home
//           </Link>
//           <Link
//             href="/dashboard"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Dashboard
//           </Link>
//           <Link
//             href="/form"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Form
//           </Link>
//           <Link
//             href="/feature"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Feature
//           </Link>
//           <Link
//             href="/pricing"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Pricing
//           </Link>
//           <Link
//             href="/user"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             User Management
//           </Link>
//           {user ? (
//             <Button
//               variant="outline"
//               onClick={handleLogout}
//               size="sm"
//               className="bg-[#483d73] hover:bg-[#3d3260] text-white hover:text-white transition-all"
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button
//               className="bg-[#483d73] hover:bg-[#3d3260] text-white"
//               asChild
//             >
//               <Link href="/login" onClick={() => setIsOpen(false)}>
//                 Sign In
//               </Link>
//             </Button>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="sm:hidden text-black focus:outline-none transition-all ml-auto top-6"
//           aria-label={isOpen ? "Close menu" : "Open menu"}
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="sm:hidden bg-gray-900 text-white w-full py-3 px-4 flex flex-col space-y-3 shadow-lg transition-all border-t border-gray-700">
//           <Link
//             href="/"
//             className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
//             onClick={() => setIsOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             href="/dashboard"
//             className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
//             onClick={() => setIsOpen(false)}
//           >
//             Dashboard
//           </Link>
//           <Link
//             href="/form"
//             className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
//             onClick={() => setIsOpen(false)}
//           >
//             Form
//           </Link>
//           <Link
//             href="/feature"
//             className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
//           >
//             Feature
//           </Link>
//           <Link
//             href="/pricing"
//             className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
//             onClick={() => setIsOpen(false)}
//           >
//             Pricing
//           </Link>
//           {user ? (
//             <Button
//               variant="outline"
//               onClick={() => {
//                 handleLogout();
//                 setIsOpen(false);
//               }}
//               className="border-gray-500 text-red-500 hover:bg-gray-700 transition-all w-full"
//               size="sm"
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button
//               variant="outline"
//               asChild
//               className="border-gray-500 text-white hover:bg-gray-700 transition-all w-full"
//               size="sm"
//             >
//               <Link href="/login" onClick={() => setIsOpen(false)}>
//                 Sign In
//               </Link>
//             </Button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";

// interface User {
//   id: number;
//   email: string;
//   isAdmin: boolean;
// }

// interface NavbarProps {
//   user: User | null;
// }

// export function Navbar({ user }: NavbarProps) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
//       router.refresh();
//       router.push("/login");
//       toast({
//         title: "Logged out successfully",
//         description: "You have been logged out of your account.",
//       });
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast({
//         title: "Logout failed",
//         description: "An error occurred while logging out. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <nav className="border-b border-[#e5e2f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between">

//         {/* Branding */}
//         <Link
//           href="/"
//           className="flex items-center gap-2"
//           onClick={() => setIsOpen(false)}
//         >
//           <p className="font-semibold text-xl text-[#2d2a4a] leading-tight">
//             CardSync
//             <span className="block text-sm text-[#483d73] font-medium">
//               With AI
//             </span>
//           </p>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden sm:flex items-center space-x-4">
//           <Link
//             href="/"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Home
//           </Link>

//           <Link
//             href="/dashboard"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Dashboard
//           </Link>

//           <Link
//             href="/form"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Form
//           </Link>

//           <Link
//             href="/feature"
//             className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//           >
//             Feature
//           </Link>

//           {/* ADMIN ONLY LINKS */}
//           {user?.isAdmin && (
//             <>
//               <Link
//                 href="/pricing"
//                 className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//               >
//                 Pricing
//               </Link>

//               <Link
//                 href="/user"
//                 className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
//               >
//                 User Management
//               </Link>
//             </>
//           )}

//           {user ? (
//             <Button
//               variant="outline"
//               onClick={handleLogout}
//               size="sm"
//               className="bg-[#483d73] hover:bg-[#3d3260] text-white hover:text-white transition-all"
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button className="bg-[#483d73] hover:bg-[#3d3260] text-white" asChild>
//               <Link href="/login" onClick={() => setIsOpen(false)}>
//                 Sign In
//               </Link>
//             </Button>
//           )}
//         </div>

//         {/* Mobile Menu Toggle */}
//         <button
//           className="sm:hidden text-black focus:outline-none ml-2"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="sm:hidden bg-white/10 backdrop-blur-sm text-center text-black w-full py-4 px-4 flex flex-col gap-4 shadow-md border-t animate-slideDown">

//           <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
//           <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
//           <Link href="/form" onClick={() => setIsOpen(false)}>Form</Link>
//           <Link href="/feature" onClick={() => setIsOpen(false)}>Feature</Link>

//           {/* ADMIN ONLY */}
//           {user?.isAdmin && (
//             <>
//               <Link href="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
//               <Link href="/user" onClick={() => setIsOpen(false)}>User Management</Link>
//             </>
//           )}

//           {user ? (
//             <Button
//               onClick={() => { handleLogout(); setIsOpen(false); }}
//               className="bg-[#483d73] hover:bg-[#3d3260] text-white w-full"
//               size="sm"
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button
//               variant="outline"
//               asChild
//               className="border-gray-500 text-white hover:bg-gray-800 w-full"
//               size="sm"
//             >
//               <Link href="/login" onClick={() => setIsOpen(false)}>
//                 Sign In
//               </Link>
//             </Button>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  organizationId?: string;
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fetch user on mount so navbar updates instantly
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });

      setUser(null); // 🔥 Update instantly in UI
      router.refresh();
      router.push("/login");

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b border-[#e5e2f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Branding */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <p className="font-semibold text-xl text-[#2d2a4a] leading-tight">
            CardSync
            <span className="block text-sm text-[#483d73] font-medium">
              With AI
            </span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/form" className="nav-link">Form</Link>
          <Link href="/feature" className="nav-link">Feature</Link>

          {/* ADMIN ONLY */}
          {user?.isAdmin && (
            <>
              <Link href="/pricing" className="nav-link">Pricing</Link>
              <Link href="/user" className="nav-link">User Management</Link>
            </>
          )}

          {user ? (
            <Button
              onClick={handleLogout}
              size="sm"
              className="bg-[#483d73] hover:bg-[#3d3260] text-white"
            >
              Logout
            </Button>
          ) : (
            <Button asChild className="bg-[#483d73] hover:bg-[#3d3260] text-white">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-black focus:outline-none ml-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden bg-white/10 backdrop-blur-sm text-center text-black w-full py-4 px-4 flex flex-col gap-4 shadow-md border-t">

          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link href="/form" onClick={() => setIsOpen(false)}>Form</Link>
          <Link href="/feature" onClick={() => setIsOpen(false)}>Feature</Link>

          {/* ADMIN ONLY */}
          {user?.isAdmin && (
            <>
              <Link href="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
              <Link href="/user" onClick={() => setIsOpen(false)}>User Management</Link>
            </>
          )}

          {user ? (
            <Button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="bg-[#483d73] hover:bg-[#3d3260] text-white w-full"
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              className="border bg-gradient-to-r from-[#483d73] to-[#352c55] text-white w-full"
            >
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
