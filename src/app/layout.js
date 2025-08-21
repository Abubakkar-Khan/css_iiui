export const metadata = { title: 'Computer Science Society', description: 'CSS @ IIUI – events, team, timeline' }
import './globals.css'
import Navbar from '@/components/Navbar'
import InteractiveGrid from '@/components/InteractiveGrid'
import Footer from '@/components/Footer'


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-white antialiased">
        {/* <div className="grid-overlay" aria-hidden /> */}
        <Navbar />
        <InteractiveGrid  />
        <main className="relative pt-20">{children}</main>
        <Footer/>
      </body>
    </html>
  )
}