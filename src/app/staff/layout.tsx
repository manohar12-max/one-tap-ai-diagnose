"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { StaffSidebar } from "@/components/staff/Sidebar"
import { StaffHeader } from "@/components/staff/Header"
import { Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (!userData.id || (userData.role !== "DOCTOR" && userData.role !== "ADMIN")) {
      router.push("/login")
    } else {
      setUser(userData)
      
      // Gatekeeper: Force Doctors to fill details before accessing other pages
      if (userData.role === "DOCTOR" && !userData.isDetailsFilled && pathname !== "/staff/settings") {
        router.push("/staff/settings")
      }
    }
    setLoading(false)
  }, [router, pathname])

  if (loading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    )
  }

  const isProfileComplete = user.isDetailsFilled || user.role === "ADMIN"

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative">
      {/* Sidebar - Fixed width 72 (288px) on desktop, absolute on mobile */}
      <StaffSidebar 
        userRole={user.role} 
        isDetailsFilled={isProfileComplete} 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300",
        "lg:ml-72"
      )}>
        <StaffHeader onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        
        <main className="flex-1 relative overflow-y-auto">
          {!isProfileComplete && pathname !== "/staff/settings" && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-center">
              <div className="max-w-md space-y-4 bg-card p-8 rounded-[2rem] border border-border shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Profile Incomplete</h2>
                <p className="text-muted-foreground font-medium">You must complete your professional clinical profile before you can access patient data or triage requests.</p>
                <Button onClick={() => router.push("/staff/settings")} className="w-full h-12 rounded-xl bg-primary font-bold uppercase tracking-widest text-xs">
                  Go to Settings
                </Button>
              </div>
            </div>
          )}
          
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
          
          <div className="p-5 md:p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
