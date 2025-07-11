import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"
import LocalFont from 'next/font/local'
import { ThemeProvider } from "@/providers/theme-provider"
import ConvexClientProvider from "@/providers/convex-client-provider"

export const metadata: Metadata = {
  title: "Softdrive",
  description: "Your hard drive for computer files.",
};

const sans = LocalFont({
  src: [
    {
      path: '../../public/regular.woff2',
      weight: '400',
    },
    {
      path: '../../public/medium.woff2',
      weight: '600',
    },
    {
      path: '../../public/bold.woff2',
      weight: '700',
    },
  ],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
