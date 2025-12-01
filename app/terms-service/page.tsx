// app/terms-of-service/page.tsx
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#483d73] to-[#352c55] text-white">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to App</span>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-6">
              Terms of Service
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 prose prose-lg dark:prose-invert">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
              1. Acceptance of Terms
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing or using the Exhibition Lead Capture Application ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              2. Use of the App
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              The App is designed for authorized sales representatives to capture business card information and leads during exhibitions and trade shows. You agree to use the App only for lawful purposes and in accordance with company policies.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              3. Data Collection & Privacy
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              All captured leads, photos, and personal data belong exclusively to your organization. We do not sell, share, or transfer this data to third parties. Photos and information are stored securely and used only for internal lead management.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              4. Photo Capture & Storage
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              The App uses your device's camera to capture business card photos. These images are uploaded securely and associated with the respective lead. You are responsible for obtaining consent before photographing any individual's business card.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              5. Submission Limits
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Each exhibition/event has a limit of 15 lead submissions. This is a company policy to ensure quality over quantity in lead capture.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              6. Account & Admin Rights
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              Only designated administrators can modify form fields and publish changes. All published forms apply instantly to all users.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              7. Prohibited Activities
            </h2>
            <ul className="mt-4 text-gray-700 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>Using the App for personal purposes</li>
              <li>Capturing leads without proper authorization</li>
              <li>Attempting to bypass submission limits</li>
              <li>Sharing login credentials</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              8. Changes to Terms
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to update these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400 mt-10">
              9. Contact Us
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms, please contact your administrator or email:
              <br />
              <a
                href="mailto:support@yourcompany.com"
                className="text-[#483d73] dark:text-purple-400 font-medium hover:underline"
              >
               cardsync422@gmail.com
              </a>
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                © 2025 CardSync. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}