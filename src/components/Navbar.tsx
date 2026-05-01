import Link from "next/link"
import { Activity, Search, Menu, Stethoscope, Video, Pill, ClipboardList } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
            <div className="bg-primary text-white p-1 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline-block tracking-tighter">OneTap<span className="text-foreground">AI</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
             <Link href="#" className="hover:text-primary transition-colors flex items-center gap-1.5">
               Find Doctors
             </Link>
             <Link href="#" className="hover:text-primary transition-colors flex items-center gap-1.5">
               Video Consult
             </Link>
             <Link href="#" className="hover:text-primary transition-colors flex items-center gap-1.5">
               Medicines
             </Link>
             <Link href="/triage" className="text-primary flex items-center gap-1.5 relative">
               AI Triage
               <span className="absolute -top-3 -right-6 px-1.5 py-0.5 bg-indigo-500 text-[8px] text-white rounded-full animate-pulse">NEW</span>
             </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center bg-secondary/50 px-4 py-2 rounded-full border border-border text-muted-foreground w-64">
             <Search size={14} className="mr-3" />
             <span className="text-[12px]">Search doctors, clinics...</span>
           </div>
           <ModeToggle />
           <Button variant="ghost" className="hidden sm:inline-flex text-[13px] font-bold">Login / Signup</Button>
           <Button variant="ghost" size="icon" className="lg:hidden">
             <Menu className="h-6 w-6" />
           </Button>
        </div>
      </div>
    </nav>
  )
}
