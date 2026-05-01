import { PulseInput } from "@/components/patient/PulseInput"
import { Navbar } from "@/components/Navbar"
import { 
  Stethoscope, 
  Hospital, 
  FlaskConical, 
  Pill, 
  Search, 
  MapPin, 
  ChevronRight, 
  User, 
  Star,
  Activity,
  Quote
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const specialties = [
    "Dentist", "Gynecologist", "Pediatrician", "Orthopedist", 
    "Dermatologist", "Physiotherapist", "Cardiologist", "Psychiatrist"
  ]

  const categories = [
    { icon: <Stethoscope size={32} />, label: "Doctors", sub: "30k+ active", color: "bg-blue-500" },
    { icon: <Hospital size={32} />, label: "Clinics", sub: "12k+ clinics", color: "bg-cyan-500" },
    { icon: <FlaskConical size={32} />, label: "Hospitals", sub: "1k+ beds", color: "bg-indigo-500" },
    { icon: <Pill size={32} />, label: "Treatments", sub: "29 active", color: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative py-20 bg-primary/5 border-b overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
               Find the nearest <span className="text-primary">Healthcare</span> providers.
             </h1>
             
             <div className="flex flex-col md:flex-row items-center gap-0 bg-card border shadow-xl rounded-2xl overflow-hidden p-1 max-w-3xl mx-auto">
                <div className="flex items-center flex-1 px-4 py-3 border-b md:border-b-0 md:border-r gap-3 w-full">
                  <MapPin size={18} className="text-muted-foreground" />
                  <input className="bg-transparent border-none outline-none w-full text-sm" placeholder="Bangalore" />
                </div>
                <div className="flex items-center flex-[2] px-4 py-3 gap-3 w-full">
                  <Search size={18} className="text-muted-foreground" />
                  <input className="bg-transparent border-none outline-none w-full text-sm" placeholder="Search Doctors, Clinics, Hospitals..." />
                </div>
                <Button className="h-12 px-8 rounded-xl font-bold m-1 w-full md:w-auto">Search</Button>
             </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
      </section>

      <section className="py-16 container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className={`w-24 h-24 rounded-full ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{cat.label}</h3>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{cat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-slate-950 dark:bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <header className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">One-Tap AI Diagnosis</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Skip the queue. Describe your symptoms and let our advanced clinical AI guide you to the right care instantly.
            </p>
          </header>
          <PulseInput />
        </div>
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      </section>

      <section className="py-20 container mx-auto px-6 border-b">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold">Top Doctor Specialties</h2>
            <Button variant="link" className="text-primary font-bold">VIEW ALL</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {specialties.map((s, i) => (
              <Button key={i} variant="outline" className="rounded-full px-6 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-medium">
                {s}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
         <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-12">Recent Patient Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[1, 2].map((_, i) => (
                 <div key={i} className="flex gap-6 p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <User size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                      </div>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "The AI triage was surprisingly accurate. It suggested I see a cardiologist immediately, which was exactly what I needed. Saved me hours of anxiety."
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs font-bold">- Verified Patient</span>
                        <div className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase">
                          Read Full Review <ChevronRight size={12} />
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <footer className="bg-slate-900 text-white py-20 mt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-2xl text-blue-400">
              <Activity className="h-6 w-6" />
              <span>OneTapAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transforming the clinical experience through instant AI-driven triage and seamless doctor connectivity.
            </p>
          </div>
          
          {[
            { title: "For Patients", links: ["Search for Doctors", "Search for Clinics", "Book Appointment", "AI Triage"] },
            { title: "For Doctors", links: ["Prisma Console", "Triage Hub", "Patient Management", "Analytics"] },
            { title: "More", links: ["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"] }
          ].map((col, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-bold text-slate-200">{col.title}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {col.links.map((link, j) => (
                  <li key={j} className="hover:text-blue-400 cursor-pointer transition-colors">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container mx-auto px-6 text-center text-slate-600 text-xs">
          © 2026 One-Tap AI-Diagnosis • Designed for Excellence
        </div>
      </footer>
    </div>
  )
}
