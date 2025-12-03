"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Empty checks
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Invalid input",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Password length
    if (password.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Confirm password match
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
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
        description: `Welcome, ${data.user.email}!`,
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred.",
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

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#483d73]"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password && password.length < 8 && (
                <p className="text-red-500 text-sm">Minimum 8 characters</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  disabled={isSubmitting}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#483d73]"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
              )}
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full py-2.5 bg-[#483d73] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#483d73]">
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