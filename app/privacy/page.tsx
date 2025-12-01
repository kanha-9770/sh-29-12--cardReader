// app/privacy-policy/page.tsx
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 prose prose-lg dark:prose-invert">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 space-y-10">
            
            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>
              
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Personal information you disclose to us</h3>
                  <p className="mt-2 text-base"><strong>In Short:</strong> We collect personal information that you provide to us.</p>
                  <p className="mt-2 text-base">
                    We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                  </p>
                  
                  <h4 className="mt-6 text-base font-medium text-gray-700">Personal Information Provided by You.</h4>
                  <p className="mt-2 text-base">
                    The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
                  </p>
                  <ul className="mt-4 list-disc pl-5 space-y-1 text-gray-600">
                    <li>Names</li>
                    <li>Email addresses</li>
                    <li>Mailing addresses</li>
                    <li>Phone numbers</li>
                    <li>Debit/credit card numbers</li>
                  </ul>

                  <h4 className="mt-6 text-base font-medium text-gray-700">Sensitive Information.</h4>
                  <p className="mt-2 text-base">We do not process sensitive information.</p>

                  <h4 className="mt-6 text-base font-medium text-gray-700">Payment Data.</h4>
                  <p className="mt-2 text-base">
                    We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Paypro Global. You may find their privacy notice link(s) here: <a href="https://payproglobal.com/compliance-data-privacy/" className="text-[#483d73] dark:text-purple-400 font-medium hover:underline">https://payproglobal.com/compliance-data-privacy/</a>
                  </p>
                  <p className="mt-2 text-base">
                    We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS?" below.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">Information automatically collected</h3>
                  <p className="mt-2 text-base"><strong>In Short:</strong> Some information—such as your Internet Protocol (IP) address and/or browser and device characteristics - is collected automatically when you visit our Services.</p>
                  <p className="mt-2 text-base">
                    We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
                  </p>
                  <p className="mt-2 text-base">
                    Like many businesses, we also collect information through cookies and similar technologies.
                  </p>

                  <h4 className="mt-6 text-base font-medium text-gray-700">The information we collect includes:</h4>
                  
                  <h5 className="mt-4 text-base font-medium text-gray-700">Log and Usage Data.</h5>
                  <p className="mt-2 text-base">
                    Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).
                  </p>

                  <h5 className="mt-4 text-base font-medium text-gray-700">Device Data.</h5>
                  <p className="mt-2 text-base">
                    We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.
                  </p>

                  <h5 className="mt-4 text-base font-medium text-gray-700">Location Data.</h5>
                  <p className="mt-2 text-base">
                    We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.
                  </p>
                  <p className="mt-2 text-base">
                    All the data we gather using GA4 is in accordance with the terms specified by Google (<a href="https://support.google.com/analytics/answer/11593727?hl=en" className="text-[#483d73] dark:text-purple-400 font-medium hover:underline">[GA4] Data collection</a>)
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                2. HOW DO WE HANDLE YOUR FILES?
              </h2>
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                <h3 className="text-lg font-medium text-gray-700">File Storage</h3>
                <p className="mt-2 text-base">
                  Files uploaded for conversion are temporarily stored on our servers to facilitate the conversion process. We do not retain these files after the conversion is completed, and they are automatically deleted from our servers.
                </p>
                
                <h3 className="text-lg font-medium text-gray-700">Data Security:</h3>
                <p className="mt-2 text-base">
                  We prioritize the security of user files and implement measures to protect against unauthorized access, alteration, disclosure, or destruction. However, it's important to note that no method of transmission over the internet or electronic storage is completely secure.
                </p>
                
                <p className="mt-2 text-base font-medium">
                  <strong>We neither share nor sell your Data:</strong> At cardscanner.co, your data privacy is our first priority, we neither share nor sell your processed data. Also, We can't create a backup of your files even if you ask us to do so. To preserve a backup or store all file contents, your agreement is required. Your files are linked solely to your IP address, and only the user initiating the conversion has the privilege to download the resulting file.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                3. HOW DO WE PROCESS YOUR INFORMATION?
              </h2>
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p className="text-base"><strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
                <p className="text-base">
                  We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-600">
                  <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                  <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
                  <li><strong>To respond to user inquiries/offer support to users.</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
                  <li><strong>To fulfill and manage your orders.</strong> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
                  <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                4. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
              </h2>
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-base"><strong>In Short:</strong> We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
              </h2>
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p className="text-base"><strong>In Short:</strong> We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.</p>
                <p className="text-base">
                  The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications.
                </p>
                <p className="text-base">
                  The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice.
                </p>
                <p className="text-base">
                  We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services.
                </p>
                <p className="text-base">
                  You should review the policies of such third parties and contact them directly to respond to your questions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
              </h2>
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p className="text-base"><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.</p>
                <p className="text-base">
                  We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
                </p>
                
                <h3 className="text-base font-medium text-gray-700 mt-4">Cookies and similar technologies:</h3>
                <p className="mt-2 text-base">
                  Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies.
                </p>
                <p className="mt-2 text-base">
                  If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.
                </p>
                
                <p className="mt-4 text-base">
                  If you have questions or comments about your privacy rights, you may email us at info[at]cardscanner[dot]co.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#483d73] dark:text-purple-400">
                7. HOW LONG DO WE KEEP YOUR INFORMATION?
              </h2>
              <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-base"><strong>In Short:</strong> We keep your information for as long as necessary to provide our services and for legitimate business purposes.</p>
                <p className="mt-2 text-base">
                  We retain your personal information for the duration necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information for the purposes described, we will securely delete or anonymize it.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                © {new Date().getFullYear()} CardSync. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}