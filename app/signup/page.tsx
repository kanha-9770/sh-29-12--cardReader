"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Invalid input",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast({
        title: "Account created successfully",
        description: `Welcome, ${data.user.email}! You are now logged in.`,
      });

      router.push("/"); // Redirect to homepage after signup
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred. Please try again.",
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
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-800 tracking-tight"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-800 tracking-tight"
              >
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

              {/* Password validation message */}
              {password.length > 0 && password.length < 8 && (
                <p className="text-red-500 text-sm">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium tracking-wide hover:bg-[#2b2447] transition-all duration-200 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#483d73] hover:text-[#2b2447] font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import Link from "next/link";
// import { Loader2 } from "lucide-react";

// export default function SignupPage() {
//   const router = useRouter();
//   const { toast } = useToast();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const hasError = confirmPassword && password !== confirmPassword;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
//       return;
//     }
//     if (password.length < 8) {
//       toast({ title: "Error", description: "Password must be 8+ characters", variant: "destructive" });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email.trim(), password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Something went wrong");

//       toast({
//         title: "Check your email!",
//         description: `We sent a 6-digit code to ${email}`,
//       });

//       // Redirect to OTP page with email in query
//       router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
//     } catch (err: any) {
//       toast({
//         title: "Signup failed",
//         description: err.message,
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
//             Sign Up
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="p-8 pt-0">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium text-gray-800">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Enter your email"
//                 disabled={isSubmitting}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73]"
//               />
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-sm font-medium text-gray-800">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="Create a password"
//                 disabled={isSubmitting}
//                 className="w-full p-3 border-gray-200 rounded-md bg-gray-50 focus:ring-1 focus:ring-[#483d73]"
//               />
//               {password && password.length < 8 && (
//                 <p className="text-sm text-red-500">Minimum 8 characters</p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div className="space-y-2">
//               <Label htmlFor="confirm" className="text-sm font-medium text-gray-800">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirm"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 placeholder="Type password again"
//                 disabled={isSubmitting}
//                 className={`w-full p-3 border rounded-md bg-gray-50 focus:ring-1 ${
//                   hasError
//                     ? "border-red-400 focus:ring-red-400 focus:border-red-400"
//                     : "border-gray-200 focus:ring-[#483d73] focus:border-[#483d73]"
//                 }`}
//               />
//               {hasError && (
//                 <p className="text-sm text-red-500">Passwords do not match</p>
//               )}
//               {passwordsMatch && !hasError && (
//                 <p className="text-sm text-green-600">Passwords match</p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               disabled={isSubmitting || hasError || password.length < 8}
//               className="w-full py-2.5 bg-[#483d73] hover:bg-[#2b2447] text-white rounded-md font-medium tracking-wide transition"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating Account...
//                 </>
//               ) : (
//                 "Sign Up"
//               )}
//             </Button>

//             <div className="text-center text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link
//                 href="/login"
//                 className="text-[#483d73] hover:text-[#2b2447] font-medium"
//               >
//                 Sign in
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
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import Link from "next/link";
// import { Loader2 } from "lucide-react";

// export default function SignupPage() {
//   const router = useRouter();
//   const { toast } = useToast();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const hasMismatch = confirmPassword && password !== confirmPassword;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password || !confirmPassword) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill in all fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (password.length < 8) {
//       toast({
//         title: "Password too short",
//         description: "Password must be at least 8 characters.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast({
//         title: "Passwords don't match",
//         description: "Please make sure both passwords are the same.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/auth/signup-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password, // ← only send these two
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.error === "Email already registered") {
//           toast({
//             title: "Email already registered",
//             description: (
//               <div className="space-y-2">
//                 <p>This email is already in use.</p>
//                 <Link href="/login" className="font-medium text-[#483d73] underline">
//                   Sign in instead
//                 </Link>
//               </div>
//             ),
//           });
//         } else {
//           toast({
//             title: "Sign up failed",
//             description: data.error || "Something went wrong",
//             variant: "destructive",
//           });
//         }
//         setIsSubmitting(false);
//         return;
//       }

//       toast({
//         title: "Check your inbox!",
//         description: `We sent a 6-digit code to ${email}`,
//       });

//       router.push(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);

//     } catch (error) {
//       toast({
//         title: "Network error",
//         description: "Please check your connection and try again.",
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
//             Sign Up
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="p-8 pt-0">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="you@example.com"
//                 disabled={isSubmitting}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:ring-1 focus:ring-[#483d73]"
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
//                 placeholder="Create a strong password"
//                 disabled={isSubmitting}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:ring-1 focus:ring-[#483d73]"
//               />
//               {password && password.length < 8 && (
//                 <p className="text-sm text-red-500">Password must be at least 8 characters</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 placeholder="Type password again"
//                 disabled={isSubmitting}
//                 className={`w-full p-3 border rounded-md bg-gray-50 focus:ring-1 ${
//                   hasMismatch
//                     ? "border-red-400 focus:ring-red-400"
//                     : "border-gray-200 focus:ring-[#483d73]"
//                 }`}
//               />
//               {hasMismatch && <p className="text-sm text-red-500">Passwords do not match</p>}
//               {!hasMismatch && confirmPassword && <p className="text-sm text-green-600">Passwords match</p>}
//             </div>

//             <Button
//               type="submit"
//               disabled={isSubmitting || hasMismatch || password.length < 8}
//               className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium hover:bg-[#2b2447] transition"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating Account...
//                 </>
//               ) : (
//                 "Sign Up"
//               )}
//             </Button>

//             <div className="text-center text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link href="/login" className="text-[#483d73] hover:text-[#2b2447] font-medium">
//                 Sign in
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }