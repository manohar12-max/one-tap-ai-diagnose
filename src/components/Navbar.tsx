"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Activity, Search, Menu, LogOut, User, LayoutDashboard, Sparkles, ChevronDown, Bell } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { toast } from "sonner"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        localStorage.removeItem("user")
        setUser(null)
        toast.success("Logged out successfully")
        router.push("/login")
        router.refresh()
      }
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const handleComingSoon = (e: React.MouseEvent, title: string) => {
    e.preventDefault()
    if (!user) {
      toast.error(`Access Denied`, {
        description: `Please login to access ${title}`,
      })
      router.push("/login")
    } else {
      toast.info(`${title} is Coming Soon!`, {
        description: "We are currently integrating this medical service. Stay tuned!",
      })
    }
  }

  // Dynamic Nav Links based on Auth State
  const navLinks = user 
    ? [
        { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={14} /> },
        { name: "AI Diagnose", href: "/diagnose", icon: <Sparkles size={14} />, isLive: true },
        { name: "Find Doctors", href: "/doctors", isComingSoon: true },
        { name: "Consult", href: "/consult", isComingSoon: true },
      ]
    : [
        { name: "Home", href: "/", icon: null },
        { name: "AI Diagnose", href: "/diagnose", icon: <Sparkles size={14} />, isLive: true },
        { name: "Find Doctors", href: "/doctors", isComingSoon: true },
        { name: "Consult", href: "/consult", isComingSoon: true },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8 h-12 flex items-center justify-between py-0.5">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 font-black text-lg text-primary group">
            <div className="bg-primary text-white p-1 rounded-lg group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/20">
              <Activity className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline-block tracking-tighter">One Tap AI <span className="text-foreground">Diagnose</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1 p-1 bg-secondary/50 rounded-2xl border border-border">
             {navLinks.map((link) => {
               const isActive = pathname === link.href
               return (
                 <Link 
                   key={link.name}
                   href={link.href}
                   onClick={(e) => link.isComingSoon && handleComingSoon(e, link.name)}
                   className={`
                     px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2
                     ${isActive 
                       ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105 z-10' 
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

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center bg-secondary/50 px-3 py-1.5 rounded-xl border border-border text-muted-foreground w-48 focus-within:w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-500">
             <Search size={12} className="mr-2 text-primary" />
             <input 
               type="text" 
               placeholder="Clinical search..." 
               className="bg-transparent border-none outline-none text-[11px] w-full font-bold placeholder:text-muted-foreground/60"
             />
           </div>
           
           <div className="flex items-center gap-2 pl-2 border-l border-border/50">
             <ModeToggle />

             {user ? (
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-secondary/80">
                     <Bell size={14} />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={handleLogout}
                     className="w-8 h-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                     title="Logout"
                   >
                     <LogOut size={14} />
                   </Button>
                   <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black border border-primary/20 cursor-pointer hover:scale-105 transition-transform">
                     {user.name.charAt(0)}
                   </div>
                </div>
             ) : (
               <div className="flex items-center gap-2">
                 <Link href="/login">
                   <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest h-11 px-5">Login</Button>
                 </Link>
                 <Link href="/register">
                   <Button className="text-[10px] font-black uppercase tracking-widest rounded-xl h-11 px-6 bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all">Join Free</Button>
                 </Link>
               </div>
             )}

             <Button variant="ghost" size="icon" className="lg:hidden w-11 h-11 rounded-xl">
               <Menu className="h-6 w-6" />
             </Button>
           </div>
        </div>
      </div>
    </nav>
  )
}
