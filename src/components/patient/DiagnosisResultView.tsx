"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Stethoscope,
  ArrowLeft,
  ChevronRight,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DiagnosisChat } from "@/components/patient/DiagnosisChat"
import { DoctorMatch } from "@/components/patient/DoctorMatch"

interface Props {
  result: any
  sessionId: string | null
  onRestart: () => void
}

export function DiagnosisResultView({ result, sessionId, onRestart }: Props) {
  const [view, setView] = useState<"result" | "chat" | "doctors">("result")

  if (view === "chat") {
    return <DiagnosisChat initialDiagnosis={result} sessionId={sessionId} onBack={() => setView("result")} />
  }

  if (view === "doctors") {
    return <DoctorMatch specialty={result.specialty} onBack={() => setView("result")} />
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={onRestart}
            className="text-muted-foreground hover:text-primary -ml-4 gap-2 font-bold"
          >
            <ArrowLeft size={18} />
            Back to Assessment
          </Button>
          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Clinical <span className="text-primary">Summary</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              {result.summary || "Generating clinical summary..."}
            </p>
          </div>
        </div>

        <div className={`
          px-8 py-3 rounded-2xl text-xs font-black tracking-[0.2em] uppercase border-2 shadow-lg
          ${result.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-600 border-red-500/30 shadow-red-500/10' : ''}
          ${result.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-600 border-orange-500/30 shadow-orange-500/10' : ''}
          ${result.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30 shadow-yellow-500/10' : ''}
          ${result.severity === 'LOW' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shadow-emerald-500/10' : ''}
        `}>
          {result.severity} SEVERITY DETECTED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 bg-card/50 border-border shadow-xl rounded-3xl space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Activity size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Medical Analysis</span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium italic">
                "{result.explanation}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Possible Conditions</h4>
                <div className="space-y-2">
                  {result.possibleConditions?.map((cond: string) => (
                    <div key={cond} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 text-sm font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {cond}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Immediate Precautions</h4>
                <div className="space-y-2">
                  {result.precautions?.map((prec: string) => (
                    <div key={prec} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      {prec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Red Flags Alert if any */}
          {result.redFlags && result.redFlags.length > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-3xl bg-red-600/10 border-2 border-red-500/20 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle size={24} />
                <h4 className="text-lg font-black uppercase tracking-widest">Urgent: Seek ER if you experience</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.redFlags.map((flag: string) => (
                  <div key={flag} className="flex items-center gap-2 text-sm font-bold text-red-700/80">
                    <AlertTriangle size={14} className="shrink-0" />
                    {flag}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <Card className="p-8 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl shadow-2xl border-0 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4">
                  <Stethoscope size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Specialty Match</p>
                <h3 className="text-2xl font-black">{result.specialty}</h3>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <Button 
                  onClick={() => setView("doctors")}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-lg shadow-primary/20 group"
                >
                  Book specialist
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setView("chat")}
                  className="w-full h-14 border-white/20 hover:bg-white/10 text-white font-black rounded-2xl gap-3"
                >
                  <MessageSquare size={18} />
                  Chat with Specialist
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border rounded-3xl space-y-6 shadow-xl">
             <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Next Clinical Steps</h4>
             <ul className="space-y-4">
               {result.nextSteps?.map((step: string, i: number) => (
                 <li key={i} className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black shrink-0 mt-1">
                     {i + 1}
                   </div>
                   <p className="text-xs font-bold text-foreground leading-snug">{step}</p>
                 </li>
               ))}
             </ul>
             <Button variant="ghost" className="w-full gap-2 text-xs font-bold uppercase tracking-widest text-primary">
               <Download size={16} />
               Download Clinical Report
             </Button>
          </Card>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-secondary/20 border border-border text-center">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Disclaimer: This AI analysis is for informational triage purposes only. It is not a clinical diagnosis. In case of emergency, please call 911 or visit the nearest ER.
        </p>
      </div>
    </div>
  )
}
