"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MessageSquare, User, Activity, Loader2, ArrowLeft, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { ChatInterface } from "@/components/appointments/ChatInterface"
import { cn } from "@/lib/utils"

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setCurrentUser(user)
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments")
      if (res.ok) {
        const data = await res.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const getUrgencyStyles = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return { color: "text-emerald-500", glow: "" };
    try {
      const appDate = new Date(dateStr);
      
      // Handle HH:mm or HH:mm AM/PM
      let hours = 0;
      let minutes = 0;
      
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const [time, modifier] = timeStr.split(" ");
        [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
      } else {
        [hours, minutes] = timeStr.split(":").map(Number);
      }
      
      appDate.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      const diffHours = (appDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 0) return { color: "text-muted-foreground", glow: "" };
      if (diffHours < 2) return { color: "text-red-500 font-black animate-pulse", glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-2 ring-red-500/20" };
      if (diffHours < 24) return { color: "text-amber-500 font-black", glow: "shadow-[0_0_10px_rgba(245,158,11,0.2)]" };
      return { color: "text-emerald-500", glow: "" };
    } catch (e) {
      return { color: "text-emerald-500", glow: "" };
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-12 pb-32 relative z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
                My <span className="text-primary">Appointments</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Manage your consultations and chats</p>
            </div>
            <div className="flex items-center gap-3">
               <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-secondary/50 font-black uppercase tracking-widest text-[10px]">
                {appointments.length} Total
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 size={48} className="animate-spin text-primary/20" />
            </div>
          ) : appointments.length === 0 ? (
            <Card className="p-20 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-secondary/50 rounded-3xl flex items-center justify-center text-muted-foreground">
                <Calendar size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">No Appointments Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium">You haven't booked any consultations yet. Find a specialist and start your journey to better health.</p>
              </div>
              <Button asChild className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
                <a href="/doctors">Find Specialists</a>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {appointments.map((app) => (
                <Card key={app.id} className="p-8 bg-card/40 backdrop-blur-xl border-border hover:border-primary/30 transition-all rounded-[2.5rem] shadow-xl group">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-secondary overflow-hidden shadow-inner border border-border">
                           <img src={app.doctor.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.doctor.name}`} alt={app.doctor.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{app.doctor.name}</h3>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{app.doctor.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge className={cn(
                               "px-3 py-1 rounded-full font-black uppercase tracking-widest text-[8px]",
                               app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                               app.status === 'IN_CONSULTATION' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                               'bg-blue-500/10 text-blue-500 border-blue-500/20'
                             )}>
                               {app.status === 'IN_CONSULTATION' ? 'CONFIRMED' : app.status}
                             </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                           <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Symptoms Reported</p>
                           <p className="text-xs font-bold text-foreground line-clamp-2">{app.symptoms}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                           <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">AI Diagnosis</p>
                           <p className="text-xs font-bold text-primary/80 line-clamp-2 italic">"{app.aiDiagnosis}"</p>
                        </div>
                      </div>

                      {app.status === 'IN_CONSULTATION' && (() => {
                        const urgency = getUrgencyStyles(app.appointmentDate, app.timeSlot);
                        return (
                          <div className={cn(
                            "flex items-center gap-6 p-4 rounded-2xl border transition-all duration-500",
                            urgency.glow || "bg-emerald-500/5 border-emerald-500/10",
                            urgency.color.includes("text-red-500") ? "bg-red-500/5 border-red-500/20" : 
                            urgency.color.includes("text-amber-500") ? "bg-amber-500/5 border-amber-500/20" : 
                            "bg-emerald-500/5 border-emerald-500/10"
                          )}>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className={cn("shrink-0", urgency.color)} />
                              <span className={cn("text-[10px] font-black uppercase tracking-widest", urgency.color)}>
                                {new Date(app.appointmentDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className={cn("flex items-center gap-2 border-l pl-6", urgency.color.includes("text-emerald") ? "border-emerald-500/20" : "border-current/20")}>
                              <Clock size={16} className={cn("shrink-0", urgency.color)} />
                              <span className={cn("text-[10px] font-black uppercase tracking-widest", urgency.color)}>
                                {app.timeSlot}
                              </span>
                            </div>
                            {urgency.color.includes("animate-pulse") && (
                              <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500 text-white text-[8px] font-black uppercase tracking-tighter shadow-lg shadow-red-500/20">
                                <Activity size={10} className="animate-spin" />
                                Starting Soon
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>

                    <div className="flex flex-col gap-3 justify-center md:w-48">
                      {app.status === 'IN_CONSULTATION' && (
                        <Button 
                          onClick={() => {
                            setSelectedAppointment(app)
                            setIsChatOpen(true)
                          }}
                          className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs gap-3 shadow-lg shadow-primary/20"
                        >
                          <MessageSquare size={18} />
                          Open Chat
                        </Button>
                      )}
                      <Button variant="ghost" className="h-12 rounded-2xl border border-border hover:bg-secondary font-black text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatOpen && selectedAppointment && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-card z-[101]"
            >
              <ChatInterface 
                appointmentId={selectedAppointment.id}
                currentUserId={currentUser.id}
                partnerName={selectedAppointment.doctor.name}
                onClose={() => setIsChatOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
