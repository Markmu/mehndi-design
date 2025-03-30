import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Henna Designs',
  description: 'Discover exquisite henna designs in our curated collection. Traditional & modern henna design inspiration for weddings, festivals & personal adornment with cultural context.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          {children}
          <Footer />
        </div>
        <GoogleTagManager gtmId={gtmId} />
      </body>
    </html>
  )
}
