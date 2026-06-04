export const metadata = {
  title: 'CSS IIUI',
  description: 'The official Computer Science Society at International Islamic University, Islamabad.',
  icons: {
    icon: '/favicon-16x16.png',
  },
}
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" type="image/png" href="/favicon-16x16.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[var(--bg)] selection:bg-white selection:text-black">
        <Navbar />
        <main className="relative z-10 pt-20">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}