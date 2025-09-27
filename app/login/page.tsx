// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
// import Link from "next/link"

// export default function LoginPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       if (!res.ok) throw new Error("Login failed")

//       const data = await res.json()

//       if (data.user.isAdmin) {
//         router.push("/")
//       } else {
//         router.push("/")
//       }

//       toast({
//         title: "Logged in successfully",
//         description: "Welcome back to your account.",
//       })
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: "Invalid credentials. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <main className="flex items-center justify-center bg-[#f3f1f8]  min-h-screen py-10">
//       <Card className="w-full max-w-md bg-white">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4 ">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full bg-[#524c88] hover:bg-[#35315a] ">
//               Login
//             </Button>
//           </form>
//           <div className="mt-4 text-center">
//             <Link href="/signup" className="text-primary hover:underline">
//               Don't have an account? Sign up
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </main>
//   )
// }

// "use client"

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#f3f1f8]">
      <Card className="w-full max-w-md rounded-2xl bg-gray-100 p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]">
        <CardHeader>
          {" "}
          <CardTitle className="text-center text-3xl font-semibold mb-2">
            Login
          </CardTitle>
          {" "}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-600 text-sm ">
                Email
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user123@gmail.com"
                className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-inner shadow-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-600 text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter Password"
                className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-inner shadow-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded shadow-inner bg-gray-100"
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[#524c88] hover:underline"
              >
                Forget password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-2 rounded-xl bg-gray-200 hover:bg-[#35315a]  shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] text-gray-700 font-medium hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition hover:text-white"
            >
              Sign In 
            </Button>

            <div className="mt-6 text-center">
              <Link href="/signup" className="text-gray-600 hover:underline">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
