import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { BrandProvider } from "@/lib/brand-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "F|A — Crafted to be Timeless",
  description:
    "F|A is an atelier of fine jewellery. Hand-crafted pieces conceived for those who understand that true luxury is silent.",
  generator: "v0.app",
  openGraph: {
    title: "F|A — Crafted to be Timeless",
    description: "An atelier of fine jewellery. Crafted to be timeless.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <BrandProvider>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </BrandProvider>
      </body>
    </html>
  )
}
