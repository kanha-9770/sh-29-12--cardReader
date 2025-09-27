import Link from "next/link"
import { CreditCard } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e5e2f0] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-[#483d73]" />
              <span className="font-semibold text-lg text-[#2d2a4a]">CardSync</span>
            </div>
            <p className="text-[#5a5570] mb-4">
              Transforming how professionals connect and network in the digital age.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((social, i) => (
                <Link
                  key={i}
                  href="#"
                  className="h-8 w-8 rounded-full bg-[#f3f1f8] flex items-center justify-center text-[#483d73] hover:bg-[#e5e2f0] transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <i className={`icon-${social.toLowerCase()}`}></i>
                </Link>
              ))}
            </div>
          </div>

          {["Product", "Company", "Support"].map((category, i) => (
            <div key={i}>
              <h3 className="font-semibold text-[#2d2a4a] mb-4">{category}</h3>
              <ul className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <li key={j}>
                    <Link href="#" className="text-[#5a5570] hover:text-[#483d73] transition-colors">
                      {category === "Product"
                        ? ["Features", "Pricing", "Integrations", "Updates"][j]
                        : category === "Company"
                          ? ["About", "Careers", "Blog", "Press"][j]
                          : ["Help Center", "Contact", "Documentation", "Status"][j]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e5e2f0] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#5a5570]">© {new Date().getFullYear()} CardSync. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-[#5a5570] hover:text-[#483d73] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-[#5a5570] hover:text-[#483d73] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-[#5a5570] hover:text-[#483d73] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
