export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f1f8] text-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-[#2d2a4a] mb-6">
          Thank you for your purchase! Your plan is now active.
        </p>
        <a
          href="/"
          className="bg-[#483d73] text-white px-6 py-3 rounded-lg hover:bg-[#5a5570] transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
