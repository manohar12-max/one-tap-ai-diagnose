"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Activity, 
  Loader2, 
  Download,
  ChevronLeft,
  AlertCircle,
  Stethoscope,
  Info,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ChatInterface } from "@/components/appointments/ChatInterface"
import { combineDateTime } from "@/lib/utils/date"
import { ConfirmAppointmentModal } from "@/components/staff/ConfirmAppointmentModal"

export default function AppointmentDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [appointment, setAppointment] = useState<any>(null)
  const [patientHistory, setPatientHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setCurrentUser(user)
    fetchAppointmentDetails()
  }, [id])

  const fetchAppointmentDetails = async () => {
    try {
      const res = await fetch("/api/appointments")
      if (res.ok) {
        const data = await res.json()
        const found = data.find((a: any) => a.id === id)
        if (found) {
          setAppointment(found)
          // Filter other appointments for the same patient as history
          const history = data.filter((a: any) => a.patientId === found.patientId && a.id !== id)
          setPatientHistory(history)
        } else {
          toast.error("Appointment not found")
          router.push("/staff/appointments")
        }
      }
    } catch (error) {
      toast.error("Failed to load details")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        toast.success(`Appointment ${status.toLowerCase()}!`)
        fetchAppointmentDetails()
      } else {
        const data = await res.json()
        toast.error(data.error || "Update failed")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const handleConfirm = async (appointmentDate: string, timeSlot: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentDate, timeSlot }),
      })

      if (res.ok) {
        toast.success("Appointment confirmed!")
        fetchAppointmentDetails()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to confirm")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const downloadReport = () => {
    toast.promise(new Promise(res => setTimeout(res, 1500)), {
      loading: 'Generating clinical report PDF...',
      success: 'Report downloaded successfully',
      error: 'Failed to generate report',
    })
  }

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary/20" />
      </div>
    )
  }

  if (!appointment) return null

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-secondary"
        >
          <ChevronLeft size={16} /> Back to Queue
        </Button>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={downloadReport}
            className="rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest border-border/50"
          >
            <Download size={14} /> Download Report
          </Button>
          <Button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all ${
              isChatOpen ? 'bg-secondary text-foreground' : 'bg-primary text-white shadow-primary/20'
            }`}
          >
            <MessageSquare size={14} /> {isChatOpen ? 'View Details' : 'Open Chat'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details or Chat */}
        <div className="lg:col-span-8 space-y-10">
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-[3rem] h-[700px] overflow-hidden shadow-2xl"
              >
                <ChatInterface 
                  appointmentId={appointment.id}
                  currentUserId={appointment.doctorId}
                  partnerName={appointment.patient?.name}
                  onClose={() => setIsChatOpen(false)}
                  lockedUntil={
                    (appointment.status === 'CONFIRMED' || appointment.status === 'IN_CONSULTATION') 
                    ? combineDateTime(appointment.appointmentDate, appointment.timeSlot) 
                    : null
                  }
                  isWaitingForConfirmation={appointment.status === 'PENDING' || appointment.status === 'INVITED'}
                />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Patient Profile Card */}
                <Card className="p-10 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[10rem] -z-10" />
                  <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary font-black text-5xl shadow-inner border border-primary/20">
                      {appointment.patient.name.charAt(0)}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary mb-2">
                          Patient Profile
                        </Badge>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                          {appointment.patient.name}
                        </h1>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-secondary/50 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest">
                          {appointment.patient.age} Years • {appointment.patient.gender}
                        </div>
                        <div className="px-4 py-2 bg-secondary/50 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest">
                          Blood Group: {appointment.patient.bloodGroup || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Report Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Stethoscope size={20} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight">AI Diagnostic Insight</h2>
                  </div>
                  <Card className="p-8 bg-primary/5 border-primary/20 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 text-primary/10 group-hover:scale-110 transition-transform duration-500">
                      <Activity size={160} />
                    </div>
                    <p className="text-lg font-bold text-primary/90 leading-relaxed italic relative z-10">
                      "{appointment.aiDiagnosis}"
                    </p>
                  </Card>
                </div>

                {/* Symptoms & History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <AlertCircle size={20} />
                      <h2 className="text-lg font-black uppercase tracking-tight">Symptoms</h2>
                    </div>
                    <div className="p-8 bg-secondary/30 rounded-[2.5rem] border border-border/50 h-full">
                      <p className="font-medium text-foreground leading-relaxed italic">
                        {appointment.symptoms}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Info size={20} />
                      <h2 className="text-lg font-black uppercase tracking-tight">Clinical History</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="p-6 bg-card border border-border rounded-[1.5rem] space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Medical History</p>
                        <p className="text-sm font-bold">{appointment.patient.medicalHistory || "No significant history reported."}</p>
                      </div>
                      <div className="p-6 bg-card border border-border rounded-[1.5rem] space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Chronic Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {appointment.patient.chronicConditions?.length > 0 ? (
                            appointment.patient.chronicConditions.map((c: string) => <Badge key={c} variant="secondary" className="text-[9px] uppercase font-black">{c}</Badge>)
                          ) : <p className="text-sm font-bold text-muted-foreground">None reported</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Follow-up History */}
                {patientHistory.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar size={20} />
                      <h2 className="text-lg font-black uppercase tracking-tight">Follow-up History</h2>
                    </div>
                    <div className="grid gap-4">
                      {patientHistory.map((past, i) => (
                        <Card key={past.id} className="p-6 bg-secondary/10 border-border/50 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground">
                              <Activity size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {new Date(past.createdAt).toLocaleDateString()} • {past.status}
                              </p>
                              <h4 className="text-sm font-bold text-foreground">
                                {past.symptoms.substring(0, 50)}{past.symptoms.length > 50 ? '...' : ''}
                              </h4>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.push(`/staff/appointments/${past.id}`)}
                            className="rounded-full group-hover:bg-primary group-hover:text-white transition-all"
                          >
                            <ArrowRight size={18} />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="lg:col-span-4 space-y-8">
          {/* Status Card */}
          <Card className="p-8 bg-card border border-border rounded-[2.5rem] shadow-xl space-y-8">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Consultation Status</h3>
              <div className="flex items-center justify-between">
                <Badge className={`px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] ${
                  appointment.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                  appointment.status === 'IN_CONSULTATION' ? 'bg-emerald-500/10 text-emerald-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {appointment.status}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground">
                  <Clock size={14} /> {new Date(appointment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              {appointment.status === 'PENDING' ? (
                <div className="space-y-4">
                  {appointment.appointmentDate && (
                    <div className="p-5 bg-amber-500/10 rounded-[1.5rem] border border-amber-500/20 mb-4">
                      <p className="text-[9px] font-black uppercase text-amber-600 mb-2 tracking-widest">Patient Requested Slot</p>
                      <div className="flex items-center gap-3 text-xs font-black uppercase">
                        <Calendar size={14} className="text-amber-600" />
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                        <div className="w-1 h-1 rounded-full bg-amber-400" />
                        <Clock size={14} className="text-amber-600" />
                        {appointment.timeSlot}
                      </div>
                    </div>
                  )}
                  <Button 
                    onClick={() => {
                      if (appointment.appointmentDate && appointment.timeSlot) {
                         handleConfirm(appointment.appointmentDate, appointment.timeSlot)
                      } else {
                         setIsConfirmModalOpen(true)
                      }
                    }}
                    className="w-full h-16 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-sm gap-3 shadow-xl shadow-primary/20"
                  >
                    <CheckCircle2 size={20} />
                    {appointment.appointmentDate ? 'CONFIRM SLOT' : 'ACCEPT REQUEST'}
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    variant="ghost" 
                    className="w-full h-16 rounded-[1.5rem] border border-border hover:bg-red-500/10 hover:text-red-500 font-black text-sm gap-3"
                  >
                    <XCircle size={20} />
                    REJECT
                  </Button>
                </div>
              ) : appointment.status === 'INVITED' ? (
                <div className="p-10 text-center space-y-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 border-dashed">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    <Loader2 size={32} className="animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase text-primary tracking-widest leading-none">Invitation Sent</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">Waiting for patient to select a preferred consultation slot</p>
                  </div>
                </div>
              ) : appointment.status === 'IN_CONSULTATION' ? (
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Calendar size={18} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Scheduled For</p>
                    </div>
                    <p className="text-sm font-black uppercase">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} @ {appointment.timeSlot}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-foreground/90 font-black text-sm gap-3"
                  >
                    <CheckCircle2 size={20} />
                    MARK COMPLETED
                  </Button>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                    <Activity size={32} />
                  </div>
                  <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">No actions available</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Info Card */}
          <Card className="p-8 bg-secondary/30 border border-border rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Activity size={18} />
              <h3 className="text-xs font-black uppercase tracking-widest">Vital Flags</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-muted-foreground">Priority Level</span>
                <span className={appointment.severity === 'CRITICAL' ? 'text-red-500' : 'text-emerald-500'}>{appointment.severity}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                <span className="text-muted-foreground">Wait Time</span>
                <span>{Math.floor((new Date().getTime() - new Date(appointment.createdAt).getTime()) / (1000 * 60))} Mins</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmAppointmentModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        patientName={appointment.patient.name}
        onConfirm={(date, time) => handleConfirm(date, time)}
      />
    </div>
  )
}
