import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'

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
    <html lang='en' data-theme='dim'>
      <body className={inter.className}>
        <div className='flex flex-col min-h-screen'>
          <Navbar />
          <main className='flex-grow bg-base-100 overflow-x-hidden'>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
