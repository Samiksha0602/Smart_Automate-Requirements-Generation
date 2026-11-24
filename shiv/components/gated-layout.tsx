"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useOnboarding } from "@/components/onboarding-provider"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import AIAssistant from "@/components/ai-assistant"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GatedLayout({ children }: { children: React.ReactNode }) {
  const { isOnboarded } = useOnboarding()
  const pathname = usePathname()
  const router = useRouter()

  // Redirect logic
  useEffect(() => {
    // If not onboarded and not on onboarding page, redirect to onboarding
    if (!isOnboarded && !pathname.includes("/onboarding")) {
      router.push("/onboarding")
    }

    // If onboarded and on onboarding page, redirect to dashboard
    if (isOnboarded && pathname.includes("/onboarding")) {
      router.push("/")
    }
  }, [isOnboarded, pathname, router])

  // If on onboarding page, only show the onboarding content
  if (pathname.includes("/onboarding")) {
    return <main className="h-screen bg-white">{children}</main>
  }

  // For all other pages, show the full layout if onboarded
  return (
    <div className="flex h-screen overflow-hidden">
      {isOnboarded && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {isOnboarded && <Navbar />}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">{children}</main>
      </div>
      {isOnboarded && <AIAssistant />}
    </div>
  )
}
