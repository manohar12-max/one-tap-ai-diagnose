"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HeartPulse, Sparkles, ArrowRight } from "lucide-react"

export function LoginIncentiveModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [lastPromptTime, setLastPromptTime] = useState(Date.now())

  useEffect(() => {
    // List of pages where the modal should NEVER appear
    const authPages = ["/login", "/register"]
    if (authPages.includes(pathname)) return

    const checkAuthAndShow = () => {
      const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
      const hasToken = typeof document !== "undefined" ? document.cookie.includes("token") : false
      
      // If not logged in and modal is currently closed
      if (!user && !hasToken && !isOpen) {
        setIsOpen(true)
      }
    }

    // Set interval for every 10 seconds
    const interval = setInterval(checkAuthAndShow, 10000)

    return () => clearInterval(interval)
  }, [pathname, isOpen])

  const handleAction = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-border bg-card/95 backdrop-blur-2xl rounded-3xl p-8 overflow-hidden shadow-2xl">
        {/* Background Decorative Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full opacity-50" />
        
        <DialogHeader className="relative z-10 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner border border-primary/20">
            <HeartPulse size={32} />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground tracking-tight leading-tight">
            Ready to Get Started?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            Join thousands of patients and doctors today. Get instant AI diagnoses and expert consultation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 mt-8 relative z-10">
          <Button 
            onClick={() => handleAction("/register")}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
          >
            <Sparkles size={18} />
            Join Free Now
          </Button>
          <Button 
            variant="ghost"
            onClick={() => handleAction("/login")}
            className="w-full h-12 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl font-bold text-sm tracking-widest uppercase transition-all gap-2"
          >
            Already have an account? Login
            <ArrowRight size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
