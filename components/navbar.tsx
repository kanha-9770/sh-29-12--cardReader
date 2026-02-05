// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { useEffect, useState } from "react";
// import { Menu, X } from "lucide-react";

// interface User {
//   id: number;
//   email: string;
//   isAdmin: boolean;
//   organizationId?: string;
// }

// export function Navbar() {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isOpen, setIsOpen] = useState(false);

//   // ✅ Fetch user on mount so navbar updates instantly
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/auth/me", { cache: "no-store" });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         setUser(null);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });

//       setUser(null); // 🔥 Update instantly in UI
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
//           <Link href="/" className="nav-link">Home</Link>
//           <Link href="/dashboard" className="nav-link">Dashboard</Link>
//           <Link href="/form" className="nav-link">Form</Link>
//           <Link href="/feature" className="nav-link">Feature</Link>

//           {/* ADMIN ONLY */}
//           {user?.isAdmin && (
//             <>
//               <Link href="/pricing" className="nav-link">Pricing</Link>
//               <Link href="/user" className="nav-link">User Management</Link>
//             </>
//           )}

//           {user ? (
//             <Button
//               onClick={handleLogout}
//               size="sm"
//               className="bg-[#483d73] hover:bg-[#3d3260] text-white"
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button asChild className="bg-[#483d73] hover:bg-[#3d3260] text-white">
//               <Link href="/login">Sign In</Link>
//             </Button>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="sm:hidden text-black focus:outline-none ml-2"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="sm:hidden bg-white/10 backdrop-blur-sm text-center text-black w-full py-4 px-4 flex flex-col gap-4 shadow-md border-t">

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
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button
//               asChild
//               className="border bg-gradient-to-r from-[#483d73] to-[#352c55] text-white w-full"
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
// import { useEffect, useState } from "react";
// import { Menu, X, User, LogOut, Settings } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface User {
//   id: string;
//   email: string;
//   isAdmin: boolean;
//   name?: string;
//   avatar?: string;
// }

// export function Navbar() {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/auth/me", { cache: "no-store" });
//         if (res.ok) {
//           const data = await res.json();
//           setUser(data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         setUser(null);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUser(null);
//       router.refresh();
//       router.push("/login");
//       toast({
//         title: "Logged out",
//         description: "See you soon!",
//       });
//       setIsOpen(false);
//     } catch (error) {
//       toast({
//         title: "Logout failed",
//         description: "Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getInitials = (email: string, name?: string) => {
//     if (name) {
//       return name
//         .split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();
//     }
//     return email.slice(0, 2).toUpperCase();
//   };

//   return (
//     <nav className="border-b border-[#e5e2f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
//           <p className="font-semibold text-xl text-[#2d2a4a] leading-tight">
//             CardSync
//             <span className="block text-sm text-[#483d73] font-medium">With AI</span>
//           </p>
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden sm:flex items-center gap-6">
//           <Link href="/" className="text-sm font-medium hover:text-[#483d73] transition">
//             Home
//           </Link>
//           <Link href="/dashboard" className="text-sm font-medium hover:text-[#483d73] transition">
//             Dashboard
//           </Link>
//           <Link href="/form" className="text-sm font-medium hover:text-[#483d73] transition">
//             Form
//           </Link>
//           <Link href="/feature" className="text-sm font-medium hover:text-[#483d73] transition">
//             Features
//           </Link>

//           {user?.isAdmin && (
//             <>
//               <Link href="/pricing" className="text-sm font-medium hover:text-[#483d73]">
//                 Pricing
//               </Link>
//             </>
//           )}

//           {/* Profile Dropdown */}
//           {user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                   <Avatar className="h-9 w-9">
//                     <AvatarImage src={user.avatar} />
//                     <AvatarFallback className="bg-[#483d73] text-white text-xs font-semibold">
//                       {getInitials(user.email, user.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">
//                       {user.name || user.email.split("@")[0]}
//                     </p>
//                     <p className="text-xs leading-none text-muted-foreground">
//                       {user.email}
//                     </p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile" className="flex items-center cursor-pointer">
//                     <User className="mr-2 h-4 w-4" />
//                     <span>Profile</span>
//                   </Link>
//                 </DropdownMenuItem>
//                 {user.isAdmin && (
//                   <DropdownMenuItem asChild>
//                     <Link href="/user" className="flex items-center cursor-pointer">
//                       <Settings className="mr-2 h-4 w-4" />
//                       <span>Admin Panel</span>
//                     </Link>
//                   </DropdownMenuItem>
//                 )}
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   className="text-red-600 focus:text-red-600 cursor-pointer"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>Log out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Button asChild className="bg-[#483d73] hover:bg-[#352c55]">
//               <Link href="/login">Sign In</Link>
//             </Button>
//           )}
//         </div>

//         {/* Mobile Menu Toggle */}
//         <button
//           className="sm:hidden text-[#2d2a4a]"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="sm:hidden border-t bg-white/95 backdrop-blur">
//           <div className="px-4 py-6 space-y-4">
//             <Link href="/" onClick={() => setIsOpen(false)} className="block text-lg">
//               Home
//             </Link>
//             <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-lg">
//               Dashboard
//             </Link>
//             <Link href="/form" onClick={() => setIsOpen(false)} className="block text-lg">
//               Form
//             </Link>
//             <Link href="/feature" onClick={() => setIsOpen(false)} className="block text-lg">
//               Features
//             </Link>

//             {user?.isAdmin && (
//               <>
//                 <Link href="/pricing" onClick={() => setIsOpen(false)} className="block text-lg">
//                   Pricing
//                 </Link>
//                 <Link href="/user" onClick={() => setIsOpen(false)} className="block text-lg">
//                   Users
//                 </Link>
//               </>
//             )}

//             {user ? (
//               <div className="pt-4 space-y-3 border-t">
//                 <div className="flex items-center gap-3 px-2">
//                   <Avatar className="h-10 w-10">
//                     <AvatarFallback className="bg-[#483d73] text-white">
//                       {getInitials(user.email, user.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{user.name || user.email.split("@")[0]}</p>
//                     <p className="text-sm text-muted-foreground">{user.email}</p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start"
//                   asChild
//                 >
//                   <Link href="/profile" onClick={() => setIsOpen(false)}>
//                     <User className="mr-2 h-4 w-4" /> Profile
//                   </Link>
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   className="w-full"
//                   onClick={() => {
//                     handleLogout();
//                     setIsOpen(false);
//                   }}
//                 >
//                   <LogOut className="mr-2 h-4 w-4" /> Log out
//                 </Button>
//               </div>
//             ) : (
//               <Button asChild className="w-full bg-[#483d73] hover:bg-[#352c55]">
//                 <Link href="/login" onClick={() => setIsOpen(false)}>
//                   Sign In
//                 </Link>
//               </Button>
//             )}
//           </div>
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
// import { useEffect, useState } from "react";
// import {
//   User,
//   LogOut,
//   LayoutDashboard,
//   ScanLine,
//   Users,
//   DollarSign,
// } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { generateAvatar } from "@/lib/avatar";

// interface UserType {
//   id: string;
//   email: string;
//   name?: string;
//   isAdmin: boolean;
//   avatar?: string; // ✅ DB field
// }

// export function Navbar() {
//   const [user, setUser] = useState<UserType | null>(null);
//   const router = useRouter();
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/auth/me", { cache: "no-store" });
//         if (!res.ok) {
//           setUser(null);
//           return;
//         }
//         const data = await res.json();
//         setUser(data.user);
//       } catch {
//         setUser(null);
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUser(null);
//       router.refresh();
//       router.push("/login");
//       toast({ title: "Logged out", description: "See you soon!" });
//     } catch {
//       toast({ title: "Logout failed", variant: "destructive" });
//     }
//   };

//   const getInitials = () => {
//     if (user?.name) {
//       return user.name
//         .split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();
//     }
//     return user?.email.slice(0, 2).toUpperCase() || "U";
//   };

//   return (
//     <nav className="border-b border-[#e5e2f0] bg-white/80 backdrop-blur sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between">

//         {/* LOGO */}
//         <Link href="/" className="flex items-center gap-2">
//           <p className="font-semibold text-xl text-[#2d2a4a] leading-tight">
//             CardSync
//             <span className="block text-sm text-[#483d73] font-medium">
//               With AI
//             </span>
//           </p>
//         </Link>

//         {/* NAV LINKS */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link href="/" className="hover:text-[#483d73] font-medium">Home</Link>
//           <Link href="/dashboard" className="hover:text-[#483d73] font-medium">Dashboard</Link>
//           <Link href="/form" className="hover:text-[#483d73] font-medium">Form</Link>

//           {user?.isAdmin && (
//             <>
//               <Link href="/pricing" className="hover:text-[#483d73] font-medium">
//                 Pricing
//               </Link>
//               <Link href="/user" className="hover:text-[#483d73] font-medium">
//                 User Management
//               </Link>
//             </>
//           )}
//         </div>

//         {/* PROFILE */}
//         {user ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
//                 <Avatar className="h-10 w-10 ring-2 ring-[#483d73]/20">
//                   <AvatarImage
//                     src={user.avatar || generateAvatar(user.email)}
//                     alt="Profile"
//                   />
//                   <AvatarFallback className="bg-[#483d73] text-white text-sm font-bold">
//                     {getInitials()}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-64 mt-2">

//               {/* HEADER */}
//               <DropdownMenuLabel>
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage
//                       src={user.avatar || generateAvatar(user.email)}
//                     />
//                     <AvatarFallback>{getInitials()}</AvatarFallback>
//                   </Avatar>

//                   <div>
//                     <p className="text-sm font-medium">
//                       {user.name || user.email.split("@")[0]}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {user.email}
//                     </p>
//                   </div>
//                 </div>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               {/* LINKS */}
//               <DropdownMenuItem asChild>
//                 <Link href="/profile" className="flex gap-2 items-center">
//                   <User className="h-4 w-4" /> Profile
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild className="md:hidden">
//                 <Link href="/dashboard" className="flex gap-2 items-center">
//                   <LayoutDashboard className="h-4 w-4" /> Dashboard
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild className="md:hidden">
//                 <Link href="/form" className="flex gap-2 items-center">
//                   <ScanLine className="h-4 w-4" /> Scan Card
//                 </Link>
//               </DropdownMenuItem>

//               {user.isAdmin && (
//                 <>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem asChild className="md:hidden">
//                     <Link href="/user" className="flex gap-2 items-center">
//                       <Users className="h-4 w-4" /> User Management
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild className="md:hidden">
//                     <Link href="/pricing" className="flex gap-2 items-center">
//                       <DollarSign className="h-4 w-4" /> Pricing
//                     </Link>
//                   </DropdownMenuItem>
//                 </>
//               )}

//               <DropdownMenuSeparator />

//               {/* LOGOUT */}
//               <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="text-red-600 cursor-pointer"
//               >
//                 <LogOut className="h-4 w-4 mr-2" /> Log out
//               </DropdownMenuItem>

//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <Button asChild className="bg-[#483d73] hover:bg-[#352c55]">
//             <Link href="/login">Sign In</Link>
//           </Button>
//         )}
//       </div>
//     </nav>
//   );
// }



// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { useEffect, useState } from "react";
// import {
//   User,
//   LogOut,
//   LayoutDashboard,
//   ScanLine,
//   Users,
//   DollarSign,
//   HelpCircle,
//   Moon,
//   Sun,
//   Sparkles,
// } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { generateAvatar } from "@/lib/avatar";

// interface UserType {
//   id: string;
//   email: string;
//   name?: string;
//   isAdmin: boolean;
//   avatar?: string;
// }

// export function Navbar() {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // null = not initialized
//   const router = useRouter();
//   const { toast } = useToast();

//   // Fetch user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch("/api/auth/me", { cache: "no-store" });
//         if (res.ok) {
//           const data = await res.json();
//           setUser(data.user);
//         }
//       } catch (err) {
//         setUser(null);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Dark mode initialization — only runs once
//   useEffect(() => {
//     const saved = localStorage.getItem("darkMode");
//     const prefersDark = window.matchMedia(
//       "(prefers-color-scheme: dark)"
//     ).matches;

//     if (saved !== null) {
//       const dark = saved === "true";
//       setIsDarkMode(dark);
//       document.documentElement.classList.toggle("dark", dark);
//     } else {
//       setIsDarkMode(prefersDark);
//       document.documentElement.classList.toggle("dark", prefersDark);
//     }
//   }, []);

//   // Listen to system theme changes — only if user hasn't chosen manually
//   useEffect(() => {
//     if (localStorage.getItem("darkMode") !== null) return; // User has preference → ignore system

//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//     const handler = (e: MediaQueryListEvent) => {
//       const systemDark = e.matches;
//       setIsDarkMode(systemDark);
//       document.documentElement.classList.toggle("dark", systemDark);
//     };

//     mediaQuery.addEventListener("change", handler);
//     return () => mediaQuery.removeEventListener("change", handler);
//   }, []);

//   const toggleDarkMode = () => {
//     const newDarkMode = !isDarkMode;
//     setIsDarkMode(newDarkMode);
//     document.documentElement.classList.toggle("dark", newDarkMode);
//     localStorage.setItem("darkMode", String(newDarkMode));
//   };

//   const handleLogout = async () => {
//     await fetch("/api/auth/logout", { method: "POST" });
//     setUser(null);
//     router.refresh();
//     router.push("/login");
//     toast({ title: "Logged out successfully", description: "See you soon!" });
//   };

//   const getInitials = () => {
//     if (user?.name) {
//       return user.name
//         .split(" ")
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();
//     }
//     return user?.email.slice(0, 2).toUpperCase() || "U";
//   };

//   // Prevent flash of wrong theme
//   if (isDarkMode === null) {
//     return (
//       <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-3">
//           <div className="h-10" /> {/* Skeleton */}
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="border-b border-[#e5e2f0] dark:border-gray-700 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2 group">
//           <div className="font-bold text-2xl text-[#2d2a4a] dark:text-white transition-all group-hover:scale-105">
//             CardSync
//             <span className="block text-sm font-medium text-[#483d73] dark:text-purple-400">
//               With AI
//             </span>
//           </div>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-8">
//           <Link
//             href="/"
//             className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
//           >
//             Home
//           </Link>
//           <Link
//             href="/dashboard"
//             className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
//           >
//             Dashboard
//           </Link>
//           <Link
//             href="/form"
//             className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
//           >
//             Scan Card
//           </Link>
//           <Link
//             href="/feature"
//             className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
//           >
//             Features
//           </Link>
//           {user?.isAdmin && (
//             <>
//               <Link
//                 href="/pricing"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
//               >
//                 Pricing
//               </Link>
//               <Link
//                 href="/user"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
//               >
//                 User Management
//               </Link>
//             </>
//           )}
//         </div>

//         {/* User Menu */}
//         {user ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="relative rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               >
//                 <Avatar className="h-9 w-9 ring-2 ring-[#483d73]/20 dark:ring-purple-500/30">
//                   <AvatarImage
//                     src={user.avatar || generateAvatar(user.email)}
//                   />
//                   <AvatarFallback className="bg-[#483d73] dark:bg-purple-600 text-white text-sm font-bold">
//                     {getInitials()}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-64 mt-2 p-2">
//               <DropdownMenuLabel>
//                 <div className="flex items-center gap-3">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage
//                       src={user.avatar || generateAvatar(user.email)}
//                     />
//                     <AvatarFallback>{getInitials()}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-semibold text-sm">
//                       {user.name || user.email.split("@")[0]}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {user.email}
//                     </p>
//                   </div>
//                 </div>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem asChild>
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-3 cursor-pointer"
//                 >
//                   <User className="h-4 w-4" />
//                   <span>My Profile</span>
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild className="md:hidden">
//                 <Link href="/dashboard" className="flex items-center gap-3">
//                   <LayoutDashboard className="h-4 w-4" />
//                   <span>Dashboard</span>
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild className="md:hidden">
//                 <Link href="/form" className="flex items-center gap-3">
//                   <ScanLine className="h-4 w-4" />
//                   <span>Scan Card</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem asChild className="md:hidden">
//                 <Link href="/feature" className="flex items-center gap-3">
//                   <Sparkles className="h-4 w-4" />
//                   <span>Features</span>
//                 </Link>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem className="font-medium text-sm text-muted-foreground">
//                 Settings
//               </DropdownMenuItem>

//               {/* Dark Mode Toggle */}
//               <DropdownMenuItem
//                 onClick={toggleDarkMode}
//                 className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <div className="flex items-center gap-3 w-full">
//                   {isDarkMode ? (
//                     <Moon className="h-4 w-4 text-purple-400" />
//                   ) : (
//                     <Sun className="h-4 w-4 text-yellow-500" />
//                   )}
//                   <span className="font-medium">
//                     {isDarkMode ? "Dark Mode" : "Light Mode"}
//                   </span>
//                 </div>
//               </DropdownMenuItem>

//               <DropdownMenuItem className="cursor-pointer">
//                 <Link href="/help" className="flex items-center gap-3">
//                   <HelpCircle className="h-4 w-4" />
//                   <span>Help & Support</span>
//                 </Link>
//               </DropdownMenuItem>

//               {user.isAdmin && (
//                 <>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className="font-semibold text-purple-600 dark:text-purple-400">
//                     Admin Tools
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/user" className="flex items-center gap-3">
//                       <Users className="h-4 w-4" />
//                       <span>User Management</span>
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/pricing" className="flex items-center gap-3">
//                       <DollarSign className="h-4 w-4" />
//                       <span>Pricing Plans</span>
//                     </Link>
//                   </DropdownMenuItem>
//                 </>
//               )}

//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="text-red-600 dark:text-red-400 font-medium"
//               >
//                 <LogOut className="h-4 w-4 mr-3" />
//                 <span>Log out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <Button
//             asChild
//             className="bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 font-medium"
//           >
//             <Link href="/login">Sign In</Link>
//           </Button>
//         )}
//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  LayoutDashboard,
  ScanLine,
  Users,
  DollarSign,
  HelpCircle,
  Moon,
  Sun,
  Sparkles,
  Settings,
  Plug,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatar } from "@/lib/avatar";

interface UserType {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  avatar?: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Dark mode initialization
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved !== null) {
      const dark = saved === "true";
      setIsDarkMode(dark);
      document.documentElement.classList.toggle("dark", dark);
    } else {
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("darkMode") !== null) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const systemDark = e.matches;
      setIsDarkMode(systemDark);
      document.documentElement.classList.toggle("dark", systemDark);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
    router.push("/login");
    toast({ title: "Logged out successfully", description: "See you soon!" });
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user?.email.slice(0, 2).toUpperCase() || "U";
  };

  if (isDarkMode === null) {
    return (
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="h-10" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-[#e5e2f0] dark:border-gray-700 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="font-bold text-2xl text-[#2d2a4a] dark:text-white transition-all group-hover:scale-105">
            CardSync
            <span className="block text-sm font-medium text-[#483d73] dark:text-purple-400">
              With AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/form"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
          >
            Scan Card
          </Link>
          <Link
            href="/feature"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
          >
            Features
          </Link>
          {user?.isAdmin && (
            <>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
              >
                Pricing
              </Link>
              <Link
                href="/user"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#483d73] dark:hover:text-purple-400 transition"
              >
                User Management
              </Link>
            </>
          )}
        </div>

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Avatar className="h-9 w-9 ring-2 ring-[#483d73]/20 dark:ring-purple-500/30">
                  <AvatarImage src={user.avatar || generateAvatar(user.email)} />
                  <AvatarFallback className="bg-[#483d73] dark:bg-purple-600 text-white text-sm font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 mt-2 p-2">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || generateAvatar(user.email)} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-3 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/form" className="flex items-center gap-3">
                  <ScanLine className="h-4 w-4" />
                  <span>Scan Card</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/feature" className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4" />
                  <span>Features</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

             

              {/* Dark Mode Toggle */}
              <DropdownMenuItem
                onClick={toggleDarkMode}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-3 w-full">
                  {isDarkMode ? (
                    <Moon className="h-4 w-4 text-purple-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="font-medium">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Link href="/help" className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>

              {user.isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-semibold text-purple-600 dark:text-purple-400">
                    Admin Tools
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user" className="flex items-center gap-3">
                      <Users className="h-4 w-4" />
                      <span>User Management</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing" className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4" />
                      <span>Pricing Plans</span>
                    </Link>
                  </DropdownMenuItem>
                   {/* Settings Section - only visible to admins */}
              {user.isAdmin && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-3 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 font-medium"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            className="bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 font-medium"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}