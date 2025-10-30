"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SubmittedPage() {
  const [count, setCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen mt-5 flex items-center  px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-card border rounded-2xl shadow-lg p-6 w-full max-w-md text-center"
      >
        {/* Icon Container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
            {/* Soft pulse */}
            <motion.div
              className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.h1
          className="text-2xl font-bold text-foreground mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Form Submited Successful
        </motion.h1>

        <motion.p
          className="text-muted-foreground mt-1 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          Thanks for submitting! Our team will process your details soon.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          Redirecting in {count} seconds…
        </motion.div>

        {/* Button */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            className="w-full rounded-lg bg-[#483d73] hover:bg-[#3e3563]"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
