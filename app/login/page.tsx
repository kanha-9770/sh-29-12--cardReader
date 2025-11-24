// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import Link from "next/link";
// import { Checkbox } from "@/components/ui/checkbox";

// export default function LoginPage() {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) throw new Error("Login failed");

//       const data = await res.json();
//       router.push("/");

//       toast({
//         title: "Logged in successfully",
//         description: "Welcome back to your account.",
//       });
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: "Invalid credentials. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <Card className="w-full max-w-md rounded-lg bg-white shadow-sm border border-gray-200">
//         <CardHeader className="p-8 text-center">
//           <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
//             Sign In
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-8 pt-4">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="text"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Enter your email"
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73] transition-all duration-200 ease-in-out"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="Enter your password"
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73] transition-all duration-200 ease-in-out"
//               />
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="remember"
//                   className="border-gray-300 data-[state=checked]:bg-[#483d73] data-[state=checked]:border-[#483d73] rounded-sm"
//                 />
//                 <Label htmlFor="remember" className="text-sm font-medium tracking-tight">
//                   Remember me
//                 </Label>
//               </div>
//               <Link
//                 href="/forgot-password"
//                 className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium tracking-wide hover:bg-[#2b2447] transition-all duration-200 ease-in-out"
//             >
//               Sign In
//             </Button>

//             <div className="text-center text-sm text-gray-600">
//               Don’t have an account?{" "}
//               <Link
//                 href="/signup"
//                 className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
//               >
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import Link from "next/link";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Loader2 } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) throw new Error("Login failed");

//       const data = await res.json();
//       router.push("/");

//       toast({
//         title: "Logged in successfully",
//         description: "Welcome back to your account.",
//       });
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: "Invalid credentials. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <Card className="w-full max-w-md rounded-lg bg-white shadow-sm border border-gray-200">
//         <CardHeader className="p-8 text-center">
//           <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
//             Sign In
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-8 pt-4">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="text"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Enter your email"
//                 disabled={isSubmitting}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73] transition-all duration-200 ease-in-out"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="Enter your password"
//                 disabled={isSubmitting}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73] transition-all duration-200 ease-in-out"
//               />
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="remember"
//                   disabled={isSubmitting}
//                   className="border-gray-300 data-[state=checked]:bg-[#483d73] data-[state=checked]:border-[#483d73] rounded-sm"
//                 />
//                 <Label htmlFor="remember" className="text-sm font-medium tracking-tight">
//                   Remember me
//                 </Label>
//               </div>
//               <Link
//                 href="/forgot-password"
//                 className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium tracking-wide hover:bg-[#2b2447] transition-all duration-200 ease-in-out"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center justify-center">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Signing In...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>

//             <div className="text-center text-sm text-gray-600">
//               Don’t have an account?{" "}
//               <Link
//                 href="/signup"
//                 className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
//               >
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      router.refresh(); // 👈 Important!
      router.push("/");

      toast({
        title: "Logged in successfully",
        description: "Welcome back to your account.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md rounded-lg bg-white shadow-sm border border-gray-200">
        <CardHeader className="p-8 text-center">
          <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-800 tracking-tight">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73] transition-all duration-200 ease-in-out"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-800 tracking-tight">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73] transition-all duration-200 ease-in-out"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  disabled={isSubmitting}
                  className="border-gray-300 data-[state=checked]:bg-[#483d73] data-[state=checked]:border-[#483d73] rounded-sm"
                />
                <Label htmlFor="remember" className="text-sm font-medium tracking-tight">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium tracking-wide hover:bg-[#2b2447] transition-all duration-200 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
