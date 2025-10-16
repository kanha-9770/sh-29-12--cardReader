export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">❌ Payment Canceled</h1>
      <p className="text-gray-700">You can restart your free trial anytime.</p>
      <a
        href="/payment"
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Try Again
      </a>
    </div>
  );
}
