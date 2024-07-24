import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'gearcheck',
  description: 'Data driven gear checking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-theme='forest'>
      <head>
        <Script
          src='https://wow.zamimg.com/js/tooltips.js'
          strategy='beforeInteractive'
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className='flex flex-col items-center justify-center min-h-screen'>
          {children}
        </main>
      </body>
    </html>
  )
}
