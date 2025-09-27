"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'

export function ClientFooterWrapper({ user }: { user: any }) {
  const pathname = usePathname()
  const hideFooter = pathname === '/login'
  console.log('ClientNavbarWrapper user:', user) // Debug log

  return !hideFooter ? <Footer /> : null
}