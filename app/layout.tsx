// import type { Metadata } from 'next'
// import './globals.css'
// import { Footer } from '@/components/footer'
// import { ClientNavbarWrapper } from '@/components/client-navbar-wrapper'

// export const metadata: Metadata = {
//   title: 'Nessco Card Reader',
//   description: 'Created with nessco by akash',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <ClientNavbarWrapper user={undefined} />
//         {children}
//         <Footer />
//       </body>
//     </html>
//   )
// }


import type { Metadata } from 'next'
import './globals.css'
import { Footer } from '@/components/footer'
import { ClientNavbarWrapper } from '@/components/client-navbar-wrapper'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Nessco Card Reader',
  description: 'Created with nessco by akash',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  const user = session?.user || null
  console.log('RootLayout user:', user) // Debug log

  return (
    <html lang="en">
      <body>
        <ClientNavbarWrapper user={user} />
        {children}
        <Footer />
      </body>
    </html>
  )
}