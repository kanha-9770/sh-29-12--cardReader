// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Loader2 } from "lucide-react";

// export default function ResetPasswordPage() {
//   const params = useSearchParams();
//   const router = useRouter();
//   const { toast } = useToast();

//   const token = params.get("token");

//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorShake, setErrorShake] = useState(false);

//   if (!token) {
//     return (
//       <main className="min-h-screen flex items-center justify-center">
//         <p className="text-center p-6 text-lg text-red-600">
//           Invalid or expired reset link.
//         </p>
//       </main>
//     );
//   }

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch("/api/auth/reset-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, password }),
//     });

//     setLoading(false);

//     if (res.ok) {
//       toast({
//         title: "Password Updated Successfully",
//         description: "Redirecting to login...",
//       });

//       // Slight delay for better UX
//       setTimeout(() => router.push("/login"), 1200);
//     } else {
//       setErrorShake(true);
//       setTimeout(() => setErrorShake(false), 500);

//       toast({
//         title: "Invalid or Expired Token",
//         description: "Please request a new reset link.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
//       <Card
//         className={`w-full max-w-md bg-white shadow-sm border border-gray-200 rounded-lg transition-all duration-300
//         ${errorShake ? "animate-shake" : "animate-fadeIn"}`}
//       >
//         <CardHeader className="text-center p-8">
//           <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
//             Reset Password
//           </CardTitle>
//           <p className="text-sm text-gray-600 mt-2">
//             Create a strong, new password to secure your account.
//           </p>
//         </CardHeader>

//         <CardContent className="p-8 pt-4">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label
//                 htmlFor="password"
//                 className="text-sm font-medium text-gray-800"
//               >
//                 New Password
//               </Label>

//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 required
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//                 className="w-full p-3 border border-gray-200 rounded-md bg-gray-50
//                 text-gray-800 focus:ring-1 focus:ring-[#483d73] focus:border-[#483d73]
//                 transition-all duration-200 ease-in-out"
//               />

//               {/* Helper text */}
//               <p className="text-xs text-gray-500">
//                 Must be at least 8 characters.
//               </p>
//             </div>

//             <Button
//               type="submit"
//               disabled={loading || password.length < 6}
//               className={`w-full py-2.5 bg-[#483d73] text-white rounded-md font-medium 
//               tracking-wide hover:bg-[#2b2447] transition-all duration-200 ease-in-out
//               ${loading ? "opacity-90 cursor-not-allowed" : ""}`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </span>
//               ) : (
//                 "Update Password"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Animations */}
//       <style jsx>{`
//         .animate-shake {
//           animation: shake 0.3s ease-in-out;
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-in-out;
//         }

//         @keyframes shake {
//           0% { transform: translateX(0); }
//           25% { transform: translateX(-4px); }
//           50% { transform: translateX(4px); }
//           75% { transform: translateX(-4px); }
//           100% { transform: translateX(0); }
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

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  // Real-time validation
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isStrongPassword = password.length >= 8;
  const canSubmit = passwordsMatch && isStrongPassword && !loading;

  useEffect(() => {
    if (touched.confirm && !passwordsMatch && confirmPassword.length > 0) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
    }
  }, [confirmPassword, passwordsMatch, touched.confirm]);

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">Failed</span>
            </div>
            <p className="text-lg text-red-600 font-medium">Invalid or expired reset link.</p>
            <Button variant="outline" className="mt-6" onClick={() => router.push("/forgot-password")}>
              Request New Link
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        toast({
          title: "Password Updated!",
          description: "Your password has been changed successfully.",
        });

        setTimeout(() => router.push("/login"), 1500);
      } else {
        const data = await res.json();
        toast({
          title: "Failed to update password",
          description: data.message || "Your link may have expired.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <Card
        className={`w-full max-w-md bg-white shadow-sm border border-gray-200 rounded-lg transition-all duration-300
        ${errorShake ? "animate-shake" : ""}`}
      >
        <CardHeader className="text-center p-8">
          <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
            Set New Password
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Choose a strong password you'll remember.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter New Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched((t) => ({ ...t, password: true }));
                }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                disabled={loading}
                className="w-full"
              />
              <p className="text-xs text-gray-500">At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setTouched((t) => ({ ...t, confirm: true }));
                }}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                disabled={loading}
                className={`w-full transition-all ${
                  touched.confirm && confirmPassword && !passwordsMatch
                    ? "border-red-500 focus:border-red-500 ring-red-200"
                    : ""
                }`}
              />

              {/* Error Message */}
              {touched.confirm && confirmPassword && !passwordsMatch && (
                <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <span>Passwords do not match</span>
                </p>
              )}

              {/* Success Match Indicator */}
              {passwordsMatch && confirmPassword.length > 0 && (
                <p className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-6 text-lg font-medium transition-all duration-200
                ${canSubmit 
                  ? "bg-[#483d73] hover:bg-[#2b2447] shadow-lg hover:shadow-xl" 
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </main>
  );
}