"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, CheckCircle2, XCircle, MessageSquare, User, Activity, Loader2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ChatInterface } from "@/components/appointments/ChatInterface"

export default function AppointmentsPage() {
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
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (id: string) => {
    const appointmentDate = prompt("Enter Appointment Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0])
    const timeSlot = prompt("Enter Time Slot (e.g. 10:00 AM):", "10:00 AM")

    if (!appointmentDate || !timeSlot) return

    try {
      const res = await fetch(`/api/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentDate, timeSlot }),
      })

      if (res.ok) {
        toast.success("Appointment confirmed!")
        fetchAppointments()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to confirm")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      <div className={`flex-1 space-y-10 overflow-y-auto pr-4 custom-scrollbar transition-all ${isChatOpen ? 'hidden lg:block lg:flex-[0.6]' : ''}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Consultation <span className="text-primary">Requests</span>
          </h1>
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
          <div className="p-12 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center text-muted-foreground mb-4">
              <Calendar size={32} />
            </div>
            <div className="text-muted-foreground text-lg font-bold uppercase tracking-widest">No pending requests</div>
            <p className="text-muted-foreground/60 max-w-md font-medium">Your calendar is currently clear. New patient requests will appear here once they book through the portal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {appointments.map((app) => (
              <Card key={app.id} className="p-8 bg-card/50 border-border hover:border-primary/30 transition-all rounded-[2.5rem] shadow-xl group">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black text-xl">
                        {app.patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{app.patient.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                          <Activity size={14} className="text-primary" />
                          Severity: <span className={app.severity === 'HIGH' || app.severity === 'CRITICAL' ? 'text-red-500' : 'text-emerald-500'}>{app.severity}</span>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <Badge className={`px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] ${
                          app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          app.status === 'IN_CONSULTATION' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {app.status === 'IN_CONSULTATION' ? 'CONFIRMED' : app.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 p-5 bg-secondary/30 rounded-[1.5rem] border border-border/50">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Symptoms</p>
                        <p className="text-sm font-bold text-foreground leading-relaxed">{app.symptoms}</p>
                      </div>
                      <div className="space-y-2 p-5 bg-primary/5 rounded-[1.5rem] border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">AI Diagnosis Insight</p>
                        <p className="text-sm font-bold text-primary/80 italic leading-relaxed line-clamp-2">"{app.aiDiagnosis}"</p>
                      </div>
                    </div>

                    {app.status === 'IN_CONSULTATION' && (
                      <div className="flex items-center gap-6 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-emerald-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-600">{new Date(app.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-emerald-500/20 pl-6">
                          <Clock size={16} className="text-emerald-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-600">{app.timeSlot}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 justify-center md:w-48">
                    {app.status === 'PENDING' ? (
                      <>
                        <Button 
                          onClick={() => handleConfirm(app.id)}
                          className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs gap-2 shadow-lg shadow-primary/20"
                        >
                          <CheckCircle2 size={16} />
                          Confirm
                        </Button>
                        <Button variant="ghost" className="h-12 rounded-2xl border border-border hover:bg-red-500/10 hover:text-red-500 font-black text-xs gap-2">
                          <XCircle size={16} />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => {
                          setSelectedAppointment(app)
                          setIsChatOpen(true)
                        }}
                        className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs gap-3 shadow-lg shadow-emerald-500/20"
                      >
                        <MessageSquare size={18} />
                        Open Chat
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isChatOpen && selectedAppointment && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full lg:relative lg:inset-auto lg:w-[450px] z-50 lg:z-0"
          >
            <ChatInterface 
              appointmentId={selectedAppointment.id}
              currentUserId={currentUser.id}
              doctorName={selectedAppointment.patient.name} // Showing patient name to doctor
              onClose={() => setIsChatOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
