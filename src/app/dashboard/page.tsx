"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Activity, 
  Brain, 
  Camera, 
  Stethoscope, 
  History, 
  ChevronRight, 
  Sparkles, 
  User, 
  Settings, 
  LogOut,
  Calendar,
  AlertCircle
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userName, setUserName] = useState("Patient")

  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.name) setUserName(userData.name)
    
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history")
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-transparent relative pb-20">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 space-y-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-2xl md:text-3xl font-black tracking-tight text-foreground"
            >
              Good morning, <span className="text-primary">{userName.split(' ')[0]}</span>
            </motion.h1>
            <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              AI Clinical Intelligence active.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="outline" className="rounded-2xl h-12 px-6 border-border bg-card/50 backdrop-blur-sm font-bold text-xs tracking-widest uppercase">
               <Settings size={18} className="mr-2" />
               Profile Settings
             </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: AI Actions */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Primary AI Scanner Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative overflow-hidden group"
            >
              <Card className="p-1 rounded-[2rem] bg-gradient-to-br from-primary via-indigo-600 to-purple-600 border-none shadow-2xl">
                <div className="bg-slate-950/90 rounded-[1.8rem] p-8 space-y-8 relative overflow-hidden">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-5 max-w-lg text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-[0.2em]">
                        <Brain size={12} />
                        Next-Gen Diagnosis
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                        Start Your <span className="text-primary italic">Deep Scan</span>
                      </h2>
                      <p className="text-slate-400 text-base leading-relaxed">
                        Analyze symptoms, upload images, or use our specialized skin condition scanner for instant results.
                      </p>
                      
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <Link href="/diagnose">
                          <Button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-widest uppercase shadow-xl shadow-primary/30 group">
                             Start Symptom Scan
                             <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-800 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase">
                           <Camera size={16} className="mr-2" />
                           Skin Analysis
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-primary/10 flex items-center justify-center relative">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-t-[12px] border-primary"
                        />
                        <div className="w-full h-full p-8">
                          <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                            <Activity size={80} className="text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent History Grid */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase text-xs tracking-[0.2em] text-muted-foreground">
                  <History size={16} />
                  Diagnostic History
                </h3>
                <Link href="/history">
                  <Button variant="ghost" className="text-primary font-bold text-sm hover:bg-primary/5">View All</Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  [1, 2].map(i => <Card key={i} className="h-48 animate-pulse bg-secondary/20 border-border rounded-3xl" />)
                ) : history.length > 0 ? (
                  history.slice(0, 4).map((item, i) => (
                    <motion.div key={item.id} variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 + (i*0.1) }}>
                      <Link href={`/diagnose/${item.id}`}>
                        <Card className="p-6 bg-card/40 border-border backdrop-blur-xl hover:border-primary/40 transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              {item.diagnosis?.severity === 'CRITICAL' ? <AlertCircle /> : <Stethoscope />}
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                              item.diagnosis?.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                              item.diagnosis?.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                              'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            )}>
                              {item.diagnosis?.severity || 'LOW'} SEVERITY
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black text-lg text-foreground line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                            <span className="text-xs font-bold text-primary">{item.diagnosis?.specialty}</span>
                            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-all" />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 p-10 text-center bg-secondary/10 rounded-3xl border border-dashed border-border">
                    <p className="text-muted-foreground font-medium">No diagnostic history found. Start your first scan!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Vitals & Status */}
          <div className="lg:col-span-4 space-y-8">
             
            {/* Quick Stats Card */}
            <Card className="p-8 bg-card/60 border-border backdrop-blur-3xl rounded-[2.5rem] shadow-xl overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">Patient Vitals</h3>
              <div className="space-y-8">
                 {[
                   { label: "Heart Rate", value: "72", unit: "BPM", trend: "+2", color: "text-red-500" },
                   { label: "Blood Oxygen", value: "98", unit: "%", trend: "Normal", color: "text-blue-500" },
                   { label: "Step Count", value: "8.4k", unit: "Steps", trend: "+12%", color: "text-emerald-500" },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <div className="space-y-1">
                       <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
                       <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-black text-foreground">{stat.value}</span>
                         <span className="text-xs font-medium text-muted-foreground">{stat.unit}</span>
                       </div>
                     </div>
                     <div className={`text-[10px] font-black px-2 py-1 rounded-lg bg-secondary/80 ${stat.color}`}>
                       {stat.trend}
                     </div>
                   </div>
                 ))}
              </div>
              <Button variant="outline" className="w-full mt-10 rounded-2xl h-14 border-primary/20 text-primary font-black text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all">
                Full Vitals Report
              </Button>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="p-8 bg-primary text-white rounded-[2.5rem] shadow-2xl shadow-primary/20">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">Next Appointment</h3>
                    <p className="text-white/60 text-xs font-bold">Tomorrow, 10:30 AM</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2">Doctor</p>
                    <p className="font-black text-lg">Dr. Sarah Mitchell</p>
                    <p className="text-sm text-white/60">Senior Cardiologist</p>
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black text-xs tracking-[0.2em] uppercase">
                    JOIN VIRTUAL ROOM
                  </Button>
               </div>
            </Card>

            {/* Quick Actions Footer */}
            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1 h-16 rounded-2xl bg-card/40 border border-border text-red-500 font-black text-xs tracking-widest uppercase hover:bg-red-500/10">
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
