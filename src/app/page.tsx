"use client"

import { PulseInput } from "@/components/patient/PulseInput"
import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Stethoscope, 
  Hospital, 
  FlaskConical, 
  Pill, 
  Search, 
  MapPin, 
  ChevronRight, 
  HeartPulse,
  User, 
  Star,
  Activity,
  Quote,
  ShieldCheck,
  Microscope,
  ClipboardPlus,
  Atom,
  Dna
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden transition-colors duration-300">
      <Navbar />

      <main className="relative z-10">
        <section id="ai-pulse" className="pt-4 pb-20 md:pt-6 md:pb-24 bg-secondary/10 dark:bg-slate-900/40 text-foreground dark:text-white overflow-hidden relative border-b border-border transition-colors duration-500">
          <div className="container mx-auto px-5 sm:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4 mb-8"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary relative z-10 border border-primary/20 backdrop-blur-xl shadow-2xl shadow-primary/20">
                  <HeartPulse size={48} className="animate-pulse" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full -z-10 animate-pulse" />
              </div>

              <div className="space-y-4 text-center">
                <h2 className="text-xl md:text-5xl font-extralight tracking-[0.2em] text-muted-foreground uppercase text-center">
                  One-Tap 
                  <span className="block text-4xl md:text-7xl font-black tracking-[-0.02em] mt-2 leading-tight transition-all text-center">
                    <span className="text-primary">AI</span>
                    <span className="text-foreground mx-2 md:mx-4 opacity-20">-</span>
                    <span className="text-foreground dark:text-white">Diagnose</span>
                  </span>
                </h2>
                <div className="h-1.5 w-24 bg-primary mx-auto rounded-full opacity-40" />
              </div>

              <p className="text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-2xl font-medium leading-relaxed">
                Skip the waiting room. Describe your symptoms and let our proprietary clinical AI provide immediate guidance.
              </p>
            </motion.div>
            <PulseInput />
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>

        <section className="relative py-24 md:py-40 bg-background/40 dark:bg-slate-950/40 text-foreground dark:text-white overflow-hidden transition-colors duration-500">
          <div className="container mx-auto px-5 sm:px-8 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-12">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
               >
                 <Activity size={14} className="animate-pulse" />
                 New: Advanced Clinical Intelligence v2.0
               </motion.div>
               
               <motion.h1 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[1.1] md:leading-[0.9] text-foreground dark:text-white"
               >
                 Instant Clinical <span className="text-primary">Clarity</span> <br className="hidden sm:block"/> 
                 Powered by AI.
               </motion.h1>
               
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="text-muted-foreground dark:text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed"
               >
                 Navigate your health with precision. Describe symptoms, get instant triage, 
                 and connect with top specialists—all in one tap.
               </motion.p>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
               >
                  <Button 
                    onClick={() => document.getElementById('ai-pulse')?.scrollIntoView({ behavior: 'smooth' })}
                    className="h-20 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-sm tracking-[0.2em] uppercase shadow-2xl shadow-primary/40 group w-full sm:w-auto transition-all hover:scale-105 active:scale-95"
                  >
                    Take Quick Analysis
                    <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-border bg-card hover:bg-secondary text-foreground dark:text-white font-bold text-sm w-full transition-all hover:scale-105 active:scale-95">
                      Join Our Network
                    </Button>
                  </Link>
               </motion.div>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none opacity-50 dark:opacity-100" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.1),transparent)] pointer-events-none opacity-50 dark:opacity-100" />
        </section>

        {/* Categories Grid */}
        <section className="py-24 container mx-auto px-5 sm:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto"
          >
            {categories.map((cat, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="flex flex-col items-center gap-6 group cursor-pointer"
              >
                <div className={`w-32 h-32 rounded-[2.5rem] ${cat.color} text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {cat.icon}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-black text-xl tracking-tight text-foreground">{cat.label}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">{cat.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>


        {/* Specialties Section */}
        <section className="py-32 container mx-auto px-5 sm:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-4xl font-black tracking-tight text-foreground">Top Medical Specialties</h2>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Connect with world-class experts</p>
              </div>
              <Button variant="outline" className="rounded-2xl px-10 h-14 font-black text-xs tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                EXPLORE ALL SPECIALISTS
              </Button>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center md:justify-start gap-4"
            >
              {specialties.map((s, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Button variant="secondary" className="rounded-2xl px-8 h-16 border border-border bg-card hover:bg-primary hover:text-white transition-all font-bold text-sm shadow-sm hover:shadow-xl hover:-translate-y-1 text-foreground">
                    {s}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 container mx-auto px-5 sm:px-8 bg-secondary/10 dark:bg-transparent transition-colors">
           <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20 space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground dark:text-white">Patient Success Stories</h2>
                <p className="text-muted-foreground font-medium">Why thousands trust One Tap AI Diagnose</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {[1, 2].map((_, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="flex flex-col sm:flex-row gap-8 p-10 bg-card border border-border rounded-[3rem] shadow-xl hover:shadow-2xl transition-all group"
                   >
                      <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <User size={48} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-lg text-foreground font-medium italic leading-relaxed">
                          "The AI triage was surprisingly accurate. It suggested I see a cardiologist immediately, which was exactly what I needed. Saved me hours of anxiety."
                        </p>
                        <div className="flex justify-between items-center pt-6 border-t border-border">
                          <div className="flex items-center gap-2">
                             <ShieldCheck size={16} className="text-emerald-500" />
                             <span className="text-sm font-black tracking-tight uppercase text-foreground">Verified Patient</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest cursor-pointer hover:underline">
                            Read Full Story <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>
      </main>
    </div>
  )
}
