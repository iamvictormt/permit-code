"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useSidebar } from "@/lib/sidebar-context"
import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "Users",
  "/dashboard/documents": "Documents",
  "/dashboard/share-codes": "Share Codes",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { toggleMobile } = useSidebar()

  const title = pageTitles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobile}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Welcome, {user?.full_name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="hidden sm:inline-flex text-xs font-normal"
        >
          {user?.role === "admin" ? "Administrator" : "User"}
        </Badge>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
