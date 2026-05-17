export const metadata = {
  title: 'CS SOCIETY // IIUI',
  description: 'The official Computer Science Society at International Islamic University, Islamabad.',
}
import './globals.css'
import Navbar from '@/components/Navbar'
import InteractiveGrid from '@/components/InteractiveGrid'
import Footer from '@/components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-black selection:bg-white selection:text-black">
        <InteractiveGrid />
        <div className="fixed inset-0 pointer-events-none tech-grid opacity-20" />
        <Navbar />
        <main className="relative z-10 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}