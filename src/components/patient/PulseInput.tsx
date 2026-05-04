"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { triageSchema } from "@/lib/ai"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Activity, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function PulseInput() {
  const [symptoms, setSymptoms] = useState("")
  const router = useRouter()
  const { object, submit, isLoading } = useObject({
    api: "/api/triage",
    schema: triageSchema,
    onError: (error) => {
      console.error("Pulse Triage Error:", error)
      toast.error("AI Service Busy", {
        description: "High demand detected. Our clinical engine is cooling down. Please retry in 30 seconds.",
        duration: 6000
      })
    }
  })

  const handleAction = () => {
    const hasToken = document.cookie.includes("token")
    if (!hasToken) {
      toast.info("Please login to start diagnosis", {
        description: "Your health insights are secured with your account.",
        duration: 4000
      })
      router.push("/login")
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    if (!handleAction()) return
    submit({ 
      symptoms: [symptoms],
      bodyPart: "unspecified",
      description: symptoms,
      intensity: 5,
      duration: "unknown"
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Card className="p-8 bg-card/40 border-primary/10 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden relative group">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-colors duration-700" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full" />
              Symptom Analysis Pulse
            </h3>
            <textarea
              autoFocus
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g. I have a persistent cough and a mild fever for 2 days..."
              className="w-full min-h-[120px] bg-secondary/50 border-border rounded-2xl p-6 text-lg resize-none placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            />
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-primary/5 pointer-events-none rounded-3xl"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <ShieldAlert size={14} className="text-primary" />
              Clinically Tuned AI • Secure & Encrypted
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !symptoms.trim()}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              One-Tap Triage
            </Button>
          </div>
        </form>
      </Card>

      <AnimatePresence>
        {object && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <Card className="p-8 border-primary/20 bg-card shadow-2xl rounded-3xl border-2">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-8 border-b border-border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    <Activity size={14} />
                    Live Clinical Assessment
                  </div>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">
                    {object.summary || "Generating Clinical Summary..."}
                  </h3>
                </div>
                {object.severity && (
                  <div className={`
                    px-6 py-2 rounded-2xl text-[11px] font-black tracking-widest uppercase border-2 shadow-sm
                    ${object.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-600 border-red-500/30' : ''}
                    ${object.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' : ''}
                    ${object.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' : ''}
                    ${object.severity === 'LOW' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : ''}
                  `}>
                    {object.severity} SEVERITY
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 block">Specialty Recommendation</span>
                    <p className="text-2xl text-primary font-black">{object.specialty || 'Analyzing Pathogens...'}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block">Detailed Explanation</span>
                    <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                      {object.explanation || 'Constructing medical rationale based on provided symptom clusters...'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-8 space-y-6 shadow-inner text-white">
                   <div className="flex items-center gap-2 text-primary">
                     <ShieldAlert size={18} />
                     <span className="text-xs font-black uppercase tracking-[0.2em]">Next Clinical Steps</span>
                   </div>
                   <ul className="space-y-4">
                     {object.nextSteps?.map((step, i) => {
                       if (!step) return null;
                       return (
                         <motion.li 
                           key={i} 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="flex items-start gap-4 text-xs font-medium text-slate-300 leading-snug group"
                         >
                           <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5 group-hover:bg-primary group-hover:text-white transition-all">
                             {i + 1}
                           </div>
                           {step}
                         </motion.li>
                       )
                     })}
                   </ul>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="h-14 px-8 rounded-2xl font-bold text-muted-foreground"
                  onClick={handleAction}
                >
                  Download Report (PDF)
                </Button>
                <Button 
                  className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm tracking-widest uppercase shadow-xl shadow-primary/20 group"
                  onClick={handleAction}
                >
                  One-Tap Book Specialist
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
