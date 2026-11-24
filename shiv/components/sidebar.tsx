"use client"

import type React from "react"

import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { LayoutDashboard, FileText, History, Settings, PlusCircle, ChevronLeft, ChevronRight, BarChart3, GitBranch } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  const { isOpen } = useSidebar()

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href={href} className="w-full">
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "w-full justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "text-blue-700" : "text-gray-500")} />
              {isOpen && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar()
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen && (
          <div className="flex items-center gap-2">
            <img 
              src="/barclayslogo.jpg" 
              alt="Barclays Logo" 
              className="h-12 w-12 object-contain rounded-md shadow" 
              style={{ background: 'white' }}
            />
          </div>
        )}
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-gray-500" onClick={toggle}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 py-4">
        <div className="space-y-1 px-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" active={pathname === "/"} />
          <SidebarItem icon={PlusCircle} label="New Session" href="/new-session" active={pathname === "/new-session"} />
          <SidebarItem icon={FileText} label="Documents" href="/documents" active={pathname === "/documents"} />
          <SidebarItem icon={History} label="History" href="/history" active={pathname === "/history"} />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" active={pathname === "/analytics"} />
          <SidebarItem icon={GitBranch} label="Jira" href="/jira" active={pathname === "/jira"} />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1 px-2">
          <SidebarItem icon={Settings} label="Settings" href="/settings" active={pathname === "/settings"} />
        </div>
      </ScrollArea>
    </div>
  )
}
