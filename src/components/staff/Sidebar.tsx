"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  ClipboardList,
  BarChart3,
  LogOut,
  Activity,
  ShieldCheck,
  Stethoscope
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const STAFF_NAV_ITEMS = [
  {
    title: "Overview",
    href: "/staff/dashboard",
    icon: LayoutDashboard,
    role: ["DOCTOR", "ADMIN"]
  },
  {
    title: "Triage Queue",
    href: "/staff/triage-queue",
    icon: ClipboardList,
    role: ["DOCTOR"]
  },
  {
    title: "Patient Vault",
    href: "/staff/patients",
    icon: Users,
    role: ["DOCTOR"]
  },
  {
    title: "Appointments",
    href: "/staff/appointments",
    icon: Calendar,
    role: ["DOCTOR"]
  },
  {
    title: "User Management",
    href: "/staff/admin/users",
    icon: ShieldCheck,
    role: ["ADMIN"]
  },
  {
    title: "Clinical Settings",
    href: "/staff/settings",
    icon: Settings,
    role: ["DOCTOR", "ADMIN"]
  },
  {
    title: "Analytics",
    href: "/staff/analytics",
    icon: BarChart3,
    role: ["DOCTOR", "ADMIN"]
  }
]

export function StaffSidebar({ userRole, isDetailsFilled }: { userRole: string, isDetailsFilled: boolean }) {
  const pathname = usePathname()

  const filteredNavItems = STAFF_NAV_ITEMS.filter(item => item.role.includes(userRole))

  return (
    <div className="w-72 h-screen bg-card/30 backdrop-blur-3xl border-r border-border flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="font-black text-foreground tracking-tighter text-xl leading-none">ONE TAP</h1>
          <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Staff Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          const isDisabled = !isDetailsFilled && item.href !== "/staff/settings" && userRole === "DOCTOR"

          const content = (
            <motion.div
              whileHover={isDisabled ? {} : { x: 5 }}
              onClick={() => {
                if (isDisabled) {
                  toast.error("Access Restricted", {
                    description: "Please complete your Clinical Settings to unlock this feature.",
                  })
                }
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                isDisabled && "opacity-50 cursor-pointer grayscale"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
              <span className="font-bold text-sm tracking-tight">{item.title}</span>
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
              {isDisabled && (
                <div className="absolute right-4">
                  <ShieldCheck size={12} className="text-amber-500" />
                </div>
              )}
            </motion.div>
          )

          if (isDisabled) {
            return <div key={item.href}>{content}</div>
          }

          return (
            <Link key={item.href} href={item.href}>
              {content}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="bg-secondary/30 rounded-3xl p-4 mb-4 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Stethoscope size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-foreground truncate uppercase tracking-widest">{userRole}</p>
              <p className="text-[10px] text-muted-foreground font-bold">Verified Provider</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl px-2"
            onClick={async () => {
              try {
                const res = await fetch("/api/auth/logout", { method: "POST" })
                if (res.ok) {
                  localStorage.removeItem("user")
                  toast.success("Signed out successfully")
                  window.location.href = "/login"
                }
              } catch (error) {
                toast.error("Logout failed")
              }
            }}
          >
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
