"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Search,
  Settings,
  User as UserIcon,
  ChevronDown,
  Menu
} from "lucide-react"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { NotificationCenter } from "@/components/NotificationCenter"

export function StaffHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-background/60 backdrop-blur-xl border-b border-border px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-xl hover:bg-secondary transition-all"
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-4 border-r border-border/50">
          <ModeToggle />
          <NotificationCenter user={user} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 pl-3 h-12 rounded-2xl hover:bg-secondary transition-all gap-3 border border-transparent hover:border-border">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-foreground uppercase tracking-tight leading-none mb-1">
                  {user?.role === 'DOCTOR' ? 'Dr. ' : ''}{user?.name?.split(' ')[0] || 'User'}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {user?.role || 'Staff'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-inner">
                {user?.name?.charAt(0) || <UserIcon size={18} />}
              </div>
              <ChevronDown size={14} className="text-muted-foreground mr-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl bg-card/80 backdrop-blur-xl border-border p-2">
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
              onClick={() => window.location.href = user?.isDetailsFilled ? "/staff/settings" : "/onboarding"}
              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors gap-2"
            >
              <UserIcon size={16} />
              {user?.isDetailsFilled ? "Profile Settings" : "Complete Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors gap-2">
              <Settings size={16} />
              Clinical Setup
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const res = await fetch("/api/auth/logout", { method: "POST" })
                  if (res.ok) {
                    localStorage.clear()
                    toast.success("Signed out successfully")
                    window.location.href = "/login"
                  }
                } catch (error) {
                  toast.error("Logout failed")
                }
              }}
              className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors gap-2"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
