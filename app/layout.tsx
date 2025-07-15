import "./globals.css"
import type { Metadata } from "next"
import LocalFont from "next/font/local"
import { Geist_Mono } from "next/font/google"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import ConvexClientProvider from "@/components/auth/ConvexClientProvider"
import { ThemeProvider } from "@/components/theme/theme-provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { OrganizationProvider } from "@/hooks/use-organization"

export const metadata: Metadata = {
  title: "Softdrive",
  description: "Your hard drive for computer files.",
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
        <body className={`${sans.variable} ${geistMono.variable} antialiased`}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <OrganizationProvider>
                <Header />
                {children}
                <Footer />
              </OrganizationProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
