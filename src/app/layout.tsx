import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { TRPCProvider } from '@/lib/trpc/provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'DentalPilot - AI-Powered Practice Operations for Dental Offices',
  description:
    'Never worry about OSHA/HIPAA compliance again. We automate everything, so you can\'t get fined.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <TRPCProvider>
          {children}
          <Toaster />
        </TRPCProvider>
      </body>
    </html>
  )
}
