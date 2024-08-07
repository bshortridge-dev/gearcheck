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
        <Navbar />
        <main className='flex flex-col items-center justify-center bg-base-100 min-h-screen overflow-x-hidden'>
          {children}
        </main>
      </body>
    </html>
  )
}
