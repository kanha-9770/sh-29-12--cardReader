"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'

export function ClientFooterWrapper({ user }: { user: any }) {
  const pathname = usePathname()
  const hideFooter = pathname === '/login' // To hide the footer in login page
  return !hideFooter ? <Footer /> : null
}
