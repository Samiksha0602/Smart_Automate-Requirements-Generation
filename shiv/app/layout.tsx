import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/sidebar-provider"
import { OnboardingProvider } from "@/components/onboarding-provider"
import GatedLayout from "@/components/gated-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI-powered Requirement Engineering System",
  description: "Enterprise B2B AI-powered Requirement Engineering System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <OnboardingProvider>
            <SidebarProvider>
              <GatedLayout>{children}</GatedLayout>
              <Toaster />
            </SidebarProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
