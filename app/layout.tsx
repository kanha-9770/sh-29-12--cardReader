// import type { Metadata } from 'next'
// import './globals.css'  
// import { ClientNavbarWrapper } from '@/components/client-navbar-wrapper'
// import { getSession } from '@/lib/auth'
// import { ClientFooterWrapper } from '@/components/client-footer-wrapper'

// export const metadata: Metadata = {
//   title: 'Nessco Card Reader',
//   description: 'Created with nessco by akash',
// }

// interface User {
//   id: number;
//   email: string;
//   isAdmin: boolean;
// }

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const session = await getSession()
//  const user: User | null = session;
//   console.log('RootLayout user:', session) // Debug log

//   return (
//     <html lang="en">
//       <body>
//         <ClientNavbarWrapper user={session} />
//         {children}
//         <ClientFooterWrapper user={session} />
//       </body>
//     </html>
//   )
// }

import type { Metadata } from 'next'
import './globals.css'  
import { ClientNavbarWrapper } from '@/components/client-navbar-wrapper'
import { getSession } from '@/lib/auth'
import { ClientFooterWrapper } from '@/components/client-footer-wrapper'

// ✅ Required to force cookie re-evaluation
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Nessco Card Reader',
  description: 'Created with nessco by akash',
}

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const user: User | null = session;

  console.log('RootLayout user:', session);

  return (
    <html lang="en">
      <body>
        <ClientNavbarWrapper user={user} />
        {children}
        <ClientFooterWrapper user={user} />
      </body>
    </html>
  )
}
