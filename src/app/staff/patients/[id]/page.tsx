"use client"

import { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft,
  Activity, 
  Calendar, 
  User,
  Mail,
  Phone,
  History,
  Loader2,
  Stethoscope,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (resolvedParams.id) {
      fetchPatientDetail()
    }
  }, [resolvedParams.id])

  const fetchPatientDetail = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/staff/patients/${resolvedParams.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPatient(data)
      } else {
        toast.error("Failed to load patient records")
        router.push("/staff/patients")
      }
    } catch (error) {
      toast.error("System error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-primary/20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Secure Clinical Vault...</p>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => router.push("/staff/patients")}
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12 border-border bg-secondary/50 hover:bg-secondary"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">{patient.name}</h1>
              <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-primary/30 text-primary">
                Patient Record
              </Badge>
            </div>
            <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
              Clinical ID: <span className="text-foreground">{patient.id}</span>
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
          <Shield size={14} />
          Encrypted Health Record
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Identity & Bio */}
        <div className="space-y-8">
          <Card className="p-8 bg-card border border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[6rem] -z-10" />
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-28 h-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary font-black text-5xl shadow-inner border border-primary/20">
                {patient.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">{patient.name}</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase">{patient.age} Years</Badge>
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase">{patient.gender}</Badge>
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase">{patient.bloodGroup}</Badge>
                </div>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-3 pt-4">
                <div className="p-5 bg-secondary/30 rounded-2xl border border-border/50 text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Visits</p>
                  <p className="text-xl font-black text-foreground">{patient.visitCount}</p>
                </div>
                <div className="p-5 bg-secondary/30 rounded-2xl border border-border/50 text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-500 uppercase">Verified</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border border-border rounded-[3rem] space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Activity size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Background</h4>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Medical History</p>
                <p className="text-sm font-bold leading-relaxed">{patient.medicalHistory || "No significant history reported."}</p>
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Chronic Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions?.length > 0 ? (
                    patient.chronicConditions.map((c: string) => (
                      <Badge key={c} variant="outline" className="px-3 py-1 rounded-lg text-[9px] font-black uppercase border-primary/30 text-primary">{c}</Badge>
                    ))
                  ) : <p className="text-xs font-bold text-muted-foreground">None reported</p>}
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="p-5 bg-secondary/20 rounded-2xl border border-border/50 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-muted-foreground shadow-sm">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p>
                <p className="text-xs font-bold truncate">{patient.email}</p>
              </div>
            </div>
            <div className="p-5 bg-secondary/20 rounded-2xl border border-border/50 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-muted-foreground shadow-sm">
                <Phone size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Mobile Contact</p>
                <p className="text-xs font-bold">{patient.mobile}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle & Right: Appointment History & Detailed Logs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Latest Summary Card */}
          <Card className="p-10 bg-primary/5 border border-primary/10 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Latest AI Assessment</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{new Date(patient.lastVisit).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xl font-black text-foreground leading-tight italic">
                    "{patient.recentDiagnosis}"
                  </p>
                </div>
              </div>
              <div className="md:w-px bg-primary/10 hidden md:block" />
              <div className="flex-1 space-y-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Recent Symptoms</p>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">
                  "{patient.appointments?.[0]?.symptoms || "N/A"}"
                </p>
              </div>
            </div>
          </Card>

          {/* Full History Timeline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <History className="text-primary" size={18} />
                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Clinical History Timeline</h4>
              </div>
              <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                {patient.appointments?.length || 0} Records Found
              </Badge>
            </div>

            <div className="space-y-4">
              {patient.appointments?.map((appt: any, i: number) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-card/40 border-border rounded-[2rem] hover:border-primary/30 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Calendar size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Consultation Date</p>
                          <p className="text-sm font-black uppercase tracking-tighter text-foreground">
                            {new Date(appt.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <Badge variant="outline" className="mt-2 px-2 py-0.5 text-[8px] font-black uppercase border-border/50">
                            Status: {appt.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 md:max-w-md">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Diagnostic Insight</p>
                        <p className="text-xs font-bold text-foreground leading-relaxed line-clamp-2 italic">"{appt.aiDiagnosis}"</p>
                      </div>

                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => router.push(`/staff/appointments?id=${appt.id}`)}
                          className="rounded-full h-10 w-10 bg-secondary/30 hover:bg-primary hover:text-white transition-all"
                        >
                          <ExternalLink size={18} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
