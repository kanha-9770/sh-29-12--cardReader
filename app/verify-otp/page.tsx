"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter 6 digits", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid or expired code");
      }

      toast({ title: "Email verified!", description: "Welcome aboard" });
      router.push("/"); // or /dashboard
    } catch (err: any) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    {
    setIsResending(true);
    try {
      await fetch("/api/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      toast({ title: "Code sent again!", description: `Check ${email}` });
      setCountdown(60);
    } catch {
      toast({ title: "Failed to resend", variant: "destructive" });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return <div className="p-8 text-center">Invalid link</div>;
  }

  return (
    <main className="flex items-center h-screen justify-center  bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md rounded-lg bg-white shadow-sm border border-gray-200">
        <CardHeader className="p-8 text-center">
          <CardTitle className="text-3xl font-light text-gray-900 tracking-wide">
            Verify Email
          </CardTitle>
          <p className="mt-2 text-gray-600">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <div className="space-y-6">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="text-center text-3xl tracking-widest letter-spacing-widest h-16 font-mono"
              disabled={isVerifying}
            />

            <Button
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 6}
              className="w-full bg-[#483d73] hover:bg-[#2b2447]"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Didn’t get the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || countdown > 0}
                className="font-medium text-[#483d73] hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push("/signup")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to signup
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}}