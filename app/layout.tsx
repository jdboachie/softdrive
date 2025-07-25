import "./globals.css"

import type { Metadata } from "next"
import LocalFont from "next/font/local"
import { Geist_Mono } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { TeamProvider } from "@/hooks/use-team"
import { ThemeProvider } from "@/components/theme/theme-provider"
import ConvexClientProvider from "@/components/auth/ConvexClientProvider"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"

export const metadata: Metadata = {
  title: "Softdrive",
  description: "Your personal drive in the cloud",
  icons: {
    icon: "/convex.svg",
  },
}

const sans = LocalFont({
  src: [
    {
      path: "../public/regular.woff2",
      weight: "400",
    },
    {
      path: "../public/medium.woff2",
      weight: "500",
    },
    {
      path: "../public/bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            async
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
          {/* rest of your scripts go under */}
        </head>
        <body className={`${sans.variable} ${geistMono.variable} antialiased`}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TeamProvider>
                <Toaster
                  richColors
                  toastOptions={{
                    style: {
                      borderRadius: "calc(var(--radius) + 6px)",
                    },
                  }}
                />
                {children}
              </TeamProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
