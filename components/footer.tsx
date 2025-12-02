import Link from "next/link";
import {
  CreditCard,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-[#e5e2f0] dark:border-gray-700 py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-7 w-7 text-[#483d73] dark:text-purple-400" />
              <p className="font-bold text-xl text-[#2d2a4a] dark:text-white leading-tight">
                CardSync
                <span className="block text-sm font-medium text-[#483d73] dark:text-purple-400">
                  With AI
                </span>
              </p>
            </div>
            <p className="text-[#5a5570] dark:text-gray-400 max-w-xs leading-relaxed">
              Transforming how professionals connect and network in the digital age.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="h-10 w-10 rounded-full bg-[#f3f1f8] dark:bg-gray-800 flex items-center justify-center text-[#483d73] dark:text-purple-400 hover:bg-[#e5e2f0] dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-sm"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-lg text-[#2d2a4a] dark:text-white mb-5 tracking-wide">
              PRODUCT
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/form", label: "Scan Card" },
                { href: "/pricing", label: "Pricing" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/user", label: "User Management" },
                { href: "/features", label: "Features" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#5a5570] dark:text-gray-400 hover:text-[#483d73] dark:hover:text-purple-400 transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Contact */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#2d2a4a] dark:text-white mb-4 tracking-wide">
                ADDRESS
              </h3>
              <p className="text-[#5a5570] dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                E-186, Apparel Park, RIICO Industrial Area,<br />
                Mahal Road, Jagatpura, Jaipur (Rajasthan)<br />
                302022, INDIA
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#2d2a4a] dark:text-white mb-4 tracking-wide">
                CONTACT US
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="tel:+919982200038"
                    className="text-[#5a5570] dark:text-gray-400 hover:text-[#483d73] dark:hover:text-purple-400 transition-colors"
                  >
                    +91 99822 00038
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+919549444484"
                    className="text-[#5a5570] dark:text-gray-400 hover:text-[#483d73] dark:hover:text-purple-400 transition-colors"
                  >
                    +91 95494 44484
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:support@cardsync.com"
                    className="text-[#5a5570] dark:text-gray-400 hover:text-[#483d73] dark:hover:text-purple-400 transition-colors break-all"
                  >
                    support@cardsync.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#e5e2f0] dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-[#5a5570] dark:text-gray-500">
            © {new Date().getFullYear()} CardSync. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[#5a5570] dark:text-gray-500 hover:text-[#483d73] dark:hover:text-purple-400 transition-colors font-medium"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}