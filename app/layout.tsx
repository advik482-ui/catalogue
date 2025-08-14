import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "CatalogueHub - Transform Your Offerings",
  description: "Create dynamic, shareable sales catalogues for your products and services",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <style>{`
          html {
            --font-montserrat: ${montserrat.style.fontFamily};
            --font-open-sans: ${openSans.style.fontFamily};
          }
        `}</style>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
