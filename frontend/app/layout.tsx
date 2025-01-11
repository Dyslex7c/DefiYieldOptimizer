import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from './components/SmoothScroll'
import { cookieToInitialState } from 'wagmi'
import { getConfig } from './config'
import { headers } from 'next/headers'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeFi Yield Optimizer',
  description: 'Maximize your returns with AI-powered yield farming on Avalanche',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );
  return (
    <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className} suppressHydrationWarning={true}>
          <Providers initialState={initialState}>
            <SmoothScroll>{children}</SmoothScroll>
          </Providers>
        </body>
    </html>
  )
}

