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
    <footer className="bg-white border-t border-[#e5e2f0] py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-[#483d73]" />
              <span className="font-semibold text-lg text-[#2d2a4a]">
                CardSync
              </span>
            </div>
            <p className="text-[#5a5570] mb-4">
              Transforming how professionals connect and network in the digital
              age.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                aria-label="Twitter"
                className="h-8 w-8 rounded-full bg-[#f3f1f8] flex items-center justify-center text-[#483d73] hover:bg-[#e5e2f0] transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="h-8 w-8 rounded-full bg-[#f3f1f8] flex items-center justify-center text-[#483d73] hover:bg-[#e5e2f0] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-[#f3f1f8] flex items-center justify-center text-[#483d73] hover:bg-[#e5e2f0] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="facebook"
                className="h-8 w-8 rounded-full bg-[#f3f1f8] flex items-center justify-center text-[#483d73] hover:bg-[#e5e2f0] transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="h-8 w-8 rounded-full bg-[#f3f1f8] flex items-center justify-center text-[#483d73] hover:bg-[#e5e2f0] transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
         

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-[#2d2a4a] mb-4">PRODUCT</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/form"
                  className="text-[#5a5570] hover:text-[#483d73] transition-colors"
                >
                  Form
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#5a5570] hover:text-[#483d73] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[#5a5570] hover:text-[#483d73] transition-colors"
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/feature"
                  className="text-[#5a5570] hover:text-[#483d73] transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          {/* <div>
            <h3 className="font-semibold text-[#2d2a4a] mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#5a5570] hover:text-[#483d73] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#5a5570] hover:text-[#483d73] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#5a5570] hover:text-[#483d73] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#5a5570] hover:text-[#483d73] transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Address Section */}
          <div>
            <h3 className="font-semibold text-[#2d2a4a] mb-4">ADDRESS</h3>
            <ul className="space-y-3 text-[#5a5570]">
              <li>
                E-186, Apparel Park, RIICO Industrial Area, Mahal Road,
                Jagatpura, Jaipur (Rajasthan) - 302022, INDIA
              </li>
              <h3 className="font-semibold text-[#2d2a4a] mb-4">CONTACT US</h3>
              <li>
                <Link
                  href="tel:+919982200038"
                  className="hover:text-[#483d73] transition-colors"
                >
                  + 91 99822 00038
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+919549444484"
                  className="hover:text-[#483d73] transition-colors"
                >
                  + 91 95494 44484
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:support@cardsync.com"
                  className="hover:text-[#483d73] transition-colors"
                >
                  support@cardsync.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#e5e2f0] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-[#5a5570]">
            © {new Date().getFullYear()} CardSync. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-sm text-[#5a5570] hover:text-[#483d73] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-[#5a5570] hover:text-[#483d73] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-[#5a5570] hover:text-[#483d73] transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
