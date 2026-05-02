"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { HeartPulse, Search, Menu, LogOut, User, LayoutDashboard, Sparkles, ChevronDown, Bell, History, Calendar } from "lucide-react"
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
        { 
          name: "Dashboard", 
          href: (user.role === 'DOCTOR' || user.role === 'ADMIN') ? "/staff/dashboard" : "/dashboard", 
          icon: <LayoutDashboard size={14} /> 
        },
        { name: "AI", href: "/diagnose", icon: <Sparkles size={14} />, isLive: true },
        { name: "Doctors", href: "/doctors", icon: <Search size={14} />, isLive: true },
        { name: "History", href: "/history", icon: <History size={14} /> },
        { name: "Bookings", href: "/appointments", icon: <Calendar size={14} /> },
        { name: "Consult", href: "/consult", isComingSoon: true },
      ]
    : [
        { name: "Home", href: "/", icon: null },
        { name: "AI", href: "/diagnose", icon: <Sparkles size={14} />, isLive: true },
        { name: "Doctors", href: "/doctors", icon: <Search size={14} />, isLive: true },
        { name: "Consult", href: "/consult", isComingSoon: true },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-black text-lg text-primary group">
            <div className="bg-primary text-white p-1 rounded-lg group-hover:rotate-12 transition-all duration-300">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline-block tracking-tighter">One Tap AI</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1 p-0.5 bg-secondary/30 rounded-xl border border-border">
             {navLinks.map((link) => {
               const isActive = pathname === link.href
               return (
                 <Link 
                   key={link.name}
                   href={link.href}
                   onClick={(e) => link.isComingSoon && handleComingSoon(e, link.name)}
                   className={`
                     px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-500 flex items-center gap-1.5
                     ${isActive 
                       ? 'bg-primary text-white shadow-lg shadow-primary/10 scale-105' 
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
           <div className="hidden xl:flex items-center bg-secondary/30 px-2.5 py-1 rounded-lg border border-border text-muted-foreground w-32 focus-within:w-48 transition-all duration-500">
             <Search size={10} className="mr-1.5 text-primary" />
             <input 
               type="text" 
               placeholder="Search..." 
               className="bg-transparent border-none outline-none text-[10px] w-full font-bold placeholder:text-muted-foreground/40"
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
