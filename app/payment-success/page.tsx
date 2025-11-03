// export default function PaymentSuccess() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f1f8] text-center">
//       <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md">
//         <h1 className="text-3xl font-bold text-green-600 mb-4">
//           Payment Successful 🎉
//         </h1>
//         <p className="text-[#2d2a4a] mb-6">
//           Thank you for your purchase! Your plan is now active.
//         </p>
//         <a
//           href="/"
//           className="bg-[#483d73] text-white px-6 py-3 rounded-lg hover:bg-[#5a5570] transition"
//         >
//           Go to Dashboard
//         </a>
//       </div>
//     </div>
//   );
// }

// app/payment-success/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState("Processing...");
  const router = useRouter();

  useEffect(() => {
    // Poll the form-count endpoint a few times to allow webhook to update DB
    let attempts = 0;
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch("/api/form-count");
        const json = await res.json();
        // When webhook updated DB, limitReached will reflect new limit
        setStatus("Payment successful — limits updated (if webhook processed).");
        // Optionally redirect user to dashboard after a short delay
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (err) {
        if (attempts < 6) setTimeout(poll, 1500); // retry
        else setStatus("Payment successful — but processing may take a moment.");
      }
    };
    poll();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
}
