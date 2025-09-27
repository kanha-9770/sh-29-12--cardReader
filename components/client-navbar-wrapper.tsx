"use client"

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/navbar'

export function ClientNavbarWrapper({ user }: { user: any }) {
  const pathname = usePathname()
  const hideNavbar = pathname === '/login'
  console.log('ClientNavbarWrapper user:', user) // Debug log

  return !hideNavbar ? <Navbar user={user} /> : null
}