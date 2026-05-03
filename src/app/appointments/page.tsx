"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  MessageSquare,
  User,
  Activity,
  Loader2,
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Info,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Navbar } from "@/components/Navbar"
import { ChatInterface } from "@/components/appointments/ChatInterface"
import { combineDateTime } from "@/lib/utils/date"
import { cn } from "@/lib/utils"

import { useSearchParams } from "next/navigation"

function AppointmentsContent() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const searchParams = useSearchParams()
  const targetId = searchParams ? searchParams.get("id") : null


  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)

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


        if (targetId) {
          const target = data.find((a: any) => a.id === targetId)
          if (target) {
            setSelectedAppointment(target)
            setIsDetailsOpen(true)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast.error("Please select a date and time slot")
      return
    }
    setBookingLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers: any = { "Content-Type": "application/json" }
      if (token && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`/api/appointments/${selectedAppointment.id}/request-slot`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ appointmentDate: bookingDate, timeSlot: bookingTime })
      })
      if (res.ok) {
        toast.success("Slot requested! Waiting for doctor confirmation.")
        setIsDetailsOpen(false)
        fetchAppointments()
      } else {
        toast.error("Failed to submit request")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setBookingLoading(false)
    }
  }

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'INVITED':
        return { label: 'Doctor Invited Follow-up', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
      case 'PENDING':
        return { label: 'Awaiting Confirmation', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
      case 'IN_CONSULTATION':
        return { label: 'Active Consultation', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
      case 'COMPLETED':
        return { label: 'Consultation Finished', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
      default:
        return { label: status, color: 'text-muted-foreground', bg: 'bg-secondary/50', border: 'border-border' }
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="container mx-auto px-5 sm:px-8 pt-16 pb-32 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <ShieldCheck size={14} />
                Secure Clinical Portal
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-foreground uppercase leading-none">
                My <span className="text-primary italic">Consultations</span>
              </h1>
              <p className="text-muted-foreground font-medium text-sm max-w-md">
                Access your history, active chats, and AI-generated diagnostic reports in one secure place.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-14 px-6 bg-secondary/30 backdrop-blur-xl border border-border rounded-2xl flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Total Bookings</span>
                  <span className="text-xl font-black text-foreground">{appointments.length}</span>
                </div>
                <div className="w-px h-6 bg-border mx-2" />
                <Activity size={24} className="text-primary animate-pulse" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 size={48} className="animate-spin text-primary/20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Syncing medical records...</p>
            </div>
          ) : appointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-20 bg-card/20 backdrop-blur-xl border-2 border-dashed border-border rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary/40 shadow-inner">
                <Calendar size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-foreground uppercase tracking-tight">No Active Consultations</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm leading-relaxed">
                  You haven't scheduled any consultations yet. Start by exploring our network of verified specialists.
                </p>
              </div>
              <Button asChild className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 group">
                <a href="/doctors" className="flex items-center gap-3">
                  Find Specialists <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {appointments.map((app, i) => {
                const status = getStatusConfig(app.status);
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden bg-card/40 backdrop-blur-2xl border-border hover:border-primary/30 transition-all duration-500 rounded-[3rem] p-8 shadow-2xl hover:shadow-primary/5">
                      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -z-10 rounded-full", status.bg)} />

                      <div className="space-y-8">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-secondary overflow-hidden shadow-inner border border-border group-hover:scale-105 transition-transform">
                              <img
                                src={app.doctor?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.doctor?.name}`}
                                alt={app.doctor?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter leading-none">{app.doctor?.name}</h3>
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{app.doctor?.specialty}</p>
                              <div className="pt-2">
                                <Badge className={cn("px-3 py-1 rounded-full font-black uppercase tracking-widest text-[8px] border", status.bg, status.color, status.border)}>
                                  {status.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-1 hidden sm:block">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Consultation ID</p>
                            <p className="text-[10px] font-bold font-mono">#{app.id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 rounded-3xl bg-secondary/30 border border-border/50 group-hover:bg-secondary/40 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity size={12} className="text-muted-foreground" />
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Reported Symptoms</span>
                            </div>
                            <p className="text-xs font-bold text-foreground line-clamp-2 leading-relaxed italic">"{app.symptoms}"</p>
                          </div>
                          <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <Stethoscope size={12} className="text-primary" />
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest">AI Assessment</span>
                            </div>
                            <p className="text-xs font-bold text-primary/80 line-clamp-2 leading-relaxed italic">"{app.aiDiagnosis}"</p>
                          </div>
                        </div>

                        {(app.status === 'IN_CONSULTATION' || app.status === 'COMPLETED') && app.appointmentDate && (
                          <div className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-secondary/20 border border-border/50">
                            <div className="flex items-center gap-3">
                              <Calendar size={16} className="text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-[0.1em]">{new Date(app.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="w-px h-4 bg-border" />
                            <div className="flex items-center gap-3">
                              <Clock size={16} className="text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-[0.1em]">{app.timeSlot}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                          <Button
                            onClick={() => {
                              setSelectedAppointment(app)
                              setIsDetailsOpen(true)
                            }}
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl border-border hover:bg-secondary font-black text-xs uppercase tracking-widest"
                          >
                            Clinical Details
                          </Button>
                          {(app.status === 'IN_CONSULTATION' || app.status === 'COMPLETED') && (
                            <Button
                              onClick={() => {
                                setSelectedAppointment(app)
                                setIsChatOpen(true)
                              }}
                              className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs gap-3 shadow-xl shadow-primary/20 uppercase tracking-widest"
                            >
                              <MessageSquare size={18} />
                              Open Consultation
                            </Button>
                          )}
                          {app.status === 'INVITED' && (
                            <Button
                              onClick={() => {
                                setSelectedAppointment(app)
                                setIsDetailsOpen(true)
                              }}
                              className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs gap-3 shadow-xl shadow-primary/20 uppercase tracking-widest"
                            >
                              <Calendar size={18} />
                              Complete Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isDetailsOpen && selectedAppointment && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-5xl bg-card border border-border rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Decorative Background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

              <div className="overflow-y-auto p-8 sm:p-14 space-y-12 relative z-10 custom-scrollbar">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border-primary/30 text-primary">
                    Diagnostic Report Summary
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => setIsDetailsOpen(false)} className="rounded-full bg-secondary/50 hover:bg-secondary">
                    <ArrowLeft size={20} />
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-secondary flex items-center justify-center text-primary font-black text-5xl shadow-inner border border-border group-hover:scale-105 transition-transform">
                    {selectedAppointment.doctor?.name?.charAt(0)}
                  </div>
                  <div className="text-center md:text-left space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">{selectedAppointment.doctor?.name}</h2>
                      <p className="text-sm font-black text-primary uppercase tracking-[0.2em]">{selectedAppointment.doctor?.specialty}</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                      <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedAppointment.status}</Badge>
                      {selectedAppointment.doctor?.clinicName && (
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-border/50">{selectedAppointment.doctor?.clinicName}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="p-10 bg-secondary/20 rounded-[3rem] border border-border/50 space-y-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Activity size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Subjective Symptoms</span>
                      </div>
                      <p className="text-base font-bold text-foreground leading-relaxed italic">"{selectedAppointment.symptoms}"</p>
                    </div>

                    <div className="p-10 bg-primary/5 rounded-[3rem] border border-primary/10 space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <Stethoscope size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Medical Assessment</span>
                      </div>
                      <p className="text-base font-bold text-primary/80 leading-relaxed italic">"{selectedAppointment.aiDiagnosis}"</p>
                    </div>

                    {selectedAppointment.status === 'INVITED' && (
                      <div className="p-10 bg-secondary/30 rounded-[3rem] border border-border/50 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 text-foreground">
                          <Calendar size={18} className="text-primary" />
                          <span className="text-[11px] font-black uppercase tracking-widest">Select Your Preferred Slot</span>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Choose Date</label>
                            <input
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full h-14 bg-background border border-border rounded-2xl px-6 font-bold text-sm outline-none focus:border-primary transition-colors"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Choose Time Slot</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {timeSlots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setBookingTime(slot)}
                                  className={cn(
                                    "h-11 rounded-xl text-[10px] font-black transition-all border",
                                    bookingTime === slot
                                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                  )}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>

                          <Button
                            onClick={handleCompleteBooking}
                            disabled={bookingLoading}
                            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm gap-3 shadow-xl shadow-primary/20 uppercase tracking-widest mt-4"
                          >
                            {bookingLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            Confirm Selection
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-5 space-y-10">
                    <div className="p-10 bg-card border border-border rounded-[3rem] space-y-8 shadow-inner">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Appointment Date</p>
                          <p className="text-sm font-black uppercase tracking-tighter leading-tight">
                            {selectedAppointment.appointmentDate ? new Date(selectedAppointment.appointmentDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending Confirmation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <Clock size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confirmed Slot</p>
                          <p className="text-sm font-black uppercase tracking-tighter leading-tight">{selectedAppointment.timeSlot || 'Awaiting Slot Allocation'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Button
                        onClick={() => {
                          setIsDetailsOpen(false)
                          setIsChatOpen(true)
                        }}
                        className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black text-base gap-4 shadow-2xl shadow-primary/20 uppercase tracking-widest"
                      >
                        <MessageSquare size={24} />
                        Enter Consultation
                      </Button>
                      <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-[0.3em] px-10">
                        Encrypted end-to-end clinical communication
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[120]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-card/95 backdrop-blur-3xl z-[130] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-border"
            >
              <div className="h-full relative">
                <ChatInterface
                  appointmentId={selectedAppointment.id}
                  currentUserId={currentUser?.id || currentUser?._id}
                  partnerName={selectedAppointment.doctor?.name}
                  onClose={() => setIsChatOpen(false)}
                  lockedUntil={
                    (selectedAppointment.status === 'CONFIRMED' || selectedAppointment.status === 'IN_CONSULTATION')
                      ? combineDateTime(selectedAppointment.appointmentDate, selectedAppointment.timeSlot)
                      : null
                  }
                  isWaitingForConfirmation={selectedAppointment.status === 'PENDING' || selectedAppointment.status === 'INVITED'}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PatientAppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-primary/20" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Syncing medical records...</p>
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  )
}
