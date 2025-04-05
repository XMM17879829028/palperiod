import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider, CalendarProvider } from './context/LanguageContext'
import Navbar from '../components/Navbar'
import Script from 'next/script'
import { cn } from '../components/ui/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PalPeriod',
  description: 'Period Calculator, Pregnancy Calculator and Sexual Behavior Calendar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        {/* Google Analytics代码 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6FN6XMQHTF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6FN6XMQHTF');
          `}
        </Script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={cn(
        "min-h-screen h-full w-full bg-background font-sans antialiased overflow-x-hidden",
        inter.className
      )}>
        <LanguageProvider>
          <CalendarProvider>
            <div className="flex flex-col min-h-screen h-full overflow-auto">
              <Navbar />
              <main className="flex-1 relative overflow-y-auto">
                {children}
              </main>
              <footer className="bg-transparent py-4 mt-10">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                  <p>© 2025 PalPeriod - All rights reserved.</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <a href="/terms" className="hover:text-gray-700">Terms of Service</a>
                    <a href="/privacy" className="hover:text-gray-700">Privacy Policy</a>
                    <a href="/contact" className="hover:text-gray-700">Contact</a>
                  </div>
                </div>
              </footer>
            </div>
          </CalendarProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}