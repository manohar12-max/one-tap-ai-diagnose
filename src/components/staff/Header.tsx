"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Search,
  Settings,
  User as UserIcon,
  ChevronDown
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

export function StaffHeader() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-background/60 backdrop-blur-xl border-b border-border px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center bg-secondary/50 px-4 py-2 rounded-2xl border border-border w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={16} className="text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search patients, records, or triage ID..."
            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-4 border-r border-border/50">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl relative hover:bg-secondary">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
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
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors gap-2">
              <UserIcon size={16} />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors gap-2">
              <Settings size={16} />
              Clinical Setup
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("user")
                toast.success("Signed out successfully")
                window.location.href = "/login"
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
