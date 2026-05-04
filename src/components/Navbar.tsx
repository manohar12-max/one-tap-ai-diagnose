"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { HeartPulse, Search, Menu, LogOut, User, LayoutDashboard, Sparkles, ChevronDown, Bell, History, Calendar, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { NotificationCenter } from "./NotificationCenter"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        localStorage.clear()
        setUser(null)
        toast.success("Logged out successfully")
        window.location.href = "/login"
      }
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const navLinks = user
    ? [
      {
        name: "Dashboard",
        href: (user.role === 'DOCTOR' || user.role === 'ADMIN') ? "/staff/dashboard" : "/dashboard",
        icon: <LayoutDashboard size={14} />
      },
      { name: "AI Diagnose", href: "/diagnose", icon: <Sparkles size={14} />, isLive: true },
      { name: "Doctors", href: "/doctors", icon: <Search size={14} />, isLive: true },
      { name: "History", href: "/history", icon: <History size={14} /> },
      { name: "Bookings", href: "/appointments", icon: <Calendar size={14} /> },
    ]
    : [
      { name: "Home", href: "/", icon: null },
      { name: "AI Diagnose", href: "/diagnose", icon: <Sparkles size={14} />, isLive: true },
      { name: "Doctors", href: "/doctors", icon: <Search size={14} />, isLive: true },
    ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-black text-lg text-primary group">
            <div className="bg-primary text-white p-1 rounded-lg group-hover:rotate-12 transition-all duration-300">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline-block tracking-tighter font-black">OTAD</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 p-0.5 bg-secondary/30 rounded-xl border border-border">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                     px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-500 flex items-center gap-2
                     ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }
                   `}
                >
                  {link.icon}
                  {link.name}
                  {link.isLive && !isActive && (
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pl-2 border-l border-border/50">
            <ModeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <NotificationCenter user={user} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hidden sm:flex w-8 h-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={14} />
                </Button>
                <Link href={user.isDetailsFilled ? "/profile-settings" : "/onboarding"} title={user.isDetailsFilled ? "Profile Settings" : "Complete Profile"}>
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black border cursor-pointer hover:scale-105 transition-all relative",
                    user.isDetailsFilled 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "bg-red-500/10 text-red-500 border-red-500/30"
                  )}>
                    {user.name.charAt(0)}
                    {!user.isDetailsFilled && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" className="text-[10px] font-black uppercase tracking-[0.15em] h-9 px-5 border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-xl transition-all">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="text-[10px] font-black uppercase tracking-[0.15em] rounded-xl h-9 px-5 bg-primary shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-white">Register</Button>
                </Link>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden w-10 h-10 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-white dark:bg-[#020617] backdrop-blur-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                       flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all
                       ${isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                      }
                     `}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              })}
              
              {!user && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest">Login</Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest">Register</Button>
                  </Link>
                </div>
              )}

              {user && (
                <div className="pt-4 border-t space-y-3">
                   <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{user.name}</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">{user.role}</p>
                        </div>
                     </div>
                     <NotificationCenter user={user} />
                   </div>
                    <Link href={user.isDetailsFilled ? "/profile-settings" : "/onboarding"} className="block">
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 border-border",
                          !user.isDetailsFilled && "border-red-500/50 text-red-500 hover:text-red-600 hover:bg-red-500/5"
                        )}
                      >
                        <User size={16} className={cn(!user.isDetailsFilled && "animate-pulse")} />
                        {user.isDetailsFilled ? "Profile Settings" : "Complete Profile"}
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
