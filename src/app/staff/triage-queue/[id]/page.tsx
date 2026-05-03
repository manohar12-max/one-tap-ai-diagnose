"use client"

import { useState, useEffect, use } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft,
  Activity, 
  User,
  Mail,
  Phone,
  History,
  Loader2,
  Stethoscope,
  Shield,
  AlertCircle,
  CheckCircle2,
  FileText,
  Thermometer,
  Pill,
  CalendarCheck
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function TriageReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (resolvedParams.id) {
      fetchTriageDetail()
    }
  }, [resolvedParams.id])

  const fetchTriageDetail = async () => {
    try {
      // Reusing a similar pattern to single history fetch if it exists, or create a new endpoint
      // For now, let's assume we can fetch it from /api/history/[id] if authenticated as staff
      const res = await fetch(`/api/history/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setSession(data)
      } else {
        toast.error("Case data not found")
        router.push("/staff/triage-queue")
      }
    } catch (error) {
      toast.error("System error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleFollowUp = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/staff/triage/${resolvedParams.id}/schedule`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("Follow-up invited successfully")
        router.push("/staff/triage-queue")
      } else {
        toast.error("Failed to schedule follow-up")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-primary/20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analyzing Clinical Data...</p>
      </div>
    )
  }

  if (!session) return null

  const diagnosis = session.diagnosis || {}

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => router.push("/staff/triage-queue")}
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12 border-border bg-secondary/50 hover:bg-secondary"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">Case <span className="text-primary">Review</span></h1>
            <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
              AI-Augmented Clinical Triage
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
          <Shield size={14} />
          Verified AI Assessment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Patient Profile Summary */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-8 bg-card border border-border rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[6rem] -z-10" />
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-[2rem] bg-secondary flex items-center justify-center text-primary font-black text-4xl shadow-inner border border-border">
                {session.user?.name?.charAt(0) || "P"}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">{session.user?.name || "Patient"}</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase">{session.user?.age || '?'} Years</Badge>
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase">{session.user?.gender || '?'}</Badge>
                </div>
              </div>
              
              <div className="w-full pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  <span>Urgency Level</span>
                  <span className={diagnosis.severity === 'CRITICAL' ? 'text-red-500' : 'text-emerald-500'}>{diagnosis.severity}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      diagnosis.severity === 'CRITICAL' ? 'bg-red-500' : 
                      diagnosis.severity === 'HIGH' ? 'bg-orange-500' : 
                      'bg-emerald-500'
                    }`} 
                    style={{ width: diagnosis.severity === 'CRITICAL' ? '100%' : diagnosis.severity === 'HIGH' ? '70%' : '30%' }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border border-border rounded-[3rem] space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Activity size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Reported Symptoms</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.symptoms?.map((s: string) => (
                <Badge key={s} variant="secondary" className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase bg-secondary/50 border border-border/50">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>

          <Button 
            onClick={handleScheduleFollowUp}
            className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-sm gap-3 shadow-2xl shadow-primary/20 uppercase tracking-widest"
          >
            <CalendarCheck size={20} />
            Schedule Follow-up
          </Button>
        </div>

        {/* Right: Full AI Diagnosis Report */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Stethoscope size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Diagnostic Summary</h2>
            </div>
            
            <Card className="p-10 bg-primary/5 border border-primary/20 rounded-[3rem] relative overflow-hidden">
               <div className="absolute -bottom-20 -right-20 text-primary/5">
                <FileText size={240} />
              </div>
              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <Badge className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">Primary Assessment</Badge>
                  <h3 className="text-3xl font-black text-foreground uppercase tracking-tight leading-tight">
                    {diagnosis.diagnosis}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <FileText size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Condition Analysis</span>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">
                      "{diagnosis.summary}"
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Thermometer size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Clinical Urgency</span>
                    </div>
                    <div className="p-4 bg-background/50 rounded-2xl border border-primary/10">
                      <p className="text-xs font-black uppercase text-foreground leading-snug">
                        {diagnosis.severity === 'CRITICAL' ? 'Immediate intervention required. Patient exhibiting severe symptoms.' : 'Stable condition. Standard clinical review recommended.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Pill size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Clinical Recommendations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diagnosis.recommendations?.map((rec: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 bg-card border border-border rounded-3xl h-full flex items-start gap-4 hover:border-primary/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-xs shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-xs font-bold text-foreground leading-relaxed">{rec}</p>
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
