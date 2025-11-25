// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Loader2, CheckCircle2 } from "lucide-react";

// export default function ForgotPasswordPage() {
//   const { toast } = useToast();
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       if (res.ok) {
//         setIsSuccess(true);
//         // Optional: still show toast, or rely only on the success UI
//         toast({
//           title: "Check your email",
//           description: "We sent a password reset link if the email is registered.",
//         });
//       } else {
//         throw new Error("Failed");
//       }
//     } catch {
//       toast({
//         title: "Something went wrong",
//         description: "Please try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Success State – Beautiful full-screen message
//   if (isSuccess) {
//     return (
//       <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
//         <Card className="w-full max-w-md animate-fadeIn">
//           <CardHeader className="text-center pb-8">
//             <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//               <CheckCircle2 className="w-10 h-10 text-green-600" />
//             </div>
//             <CardTitle className="text-2xl font-light text-gray-900">
//               Check Your Email
//             </CardTitle>
//             <CardDescription className="text-base mt-3 text-gray-600">
//               We sent a password reset link to
//               <span className="font-medium text-gray-900"> {email}</span>
//               {email ? "." : " (if it exists in our system)."}
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="text-center pb-8">
//             <Button
//               variant="outline"
//               className="mt-6"
//               onClick={() => router.push("/login")}
//             >
//               Go to Login Now
//             </Button>
//           </CardContent>
//         </Card>

//         <style>{`
//           .animate-fadeIn {
//             animation: fadeIn 0.6s ease-out forwards;
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(15px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//         `}</style>
//       </main>
//     );
//   }

//   // Original Form (only shown before success)
//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
//       <Card className="w-full max-w-md bg-white shadow-md border border-gray-200 rounded-lg animate-fadeIn">
//         <CardHeader className="p-8 text-center">
//           <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
//             Forgot Password
//           </CardTitle>
//           <p className="text-sm text-gray-600 mt-2">
//             Enter your email and we'll send you a reset link.
//           </p>
//         </CardHeader>

//         <CardContent className="p-8 pt-4">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium text-gray-800 tracking-tight">
//                 Email Address
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 required
//                 autoFocus
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isSubmitting}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 transition-all duration-200 ease-in-out"
//               />
//               <p className="text-xs text-gray-500">
//                 We will send a password reset link if your email is registered.
//               </p>
//             </div>

//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium tracking-wide hover:bg-[#2b2447] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center justify-center">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Sending Link...
//                 </span>
//               ) : (
//                 "Send Reset Link"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <style>{`
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out forwards;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    userExists: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({
          userExists: data.userExists,
          message: data.message,
        });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS: Email sent
  if (result?.userExists) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
        <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-light">Check Your Email</CardTitle>
            <CardDescription className="mt-3 text-base">
              We sent a password reset link to<br />
              <span className="font-medium text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // NOT FOUND: Guide to signup
  if (result && !result.userExists) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
        <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-light">No Account Found</CardTitle>
            <CardDescription className="mt-3 text-base">
              We couldn’t find an account with<br />
              <span className="font-medium text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">Looks like you’re new here! Join CardSync today.</p>
            <Button
              className="bg-[#483d73] hover:bg-[#2b2447]"
              onClick={() => router.push("/signup")}
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => setResult(null)}>
              Try another email
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // DEFAULT: Form
  return (                     
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md bg-white shadow-md border border-gray-200 rounded-lg animate-fadeIn">
        <CardHeader className="p-8 text-center">
          <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
            Forgot Password
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email and we'll send you a reset link.
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-800 tracking-tight">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800 transition-all duration-200 ease-in-out"
              />
              <p className="text-xs text-gray-500">
                We will send a password reset link if your email is registered.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium tracking-wide hover:bg-[#2b2447] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}