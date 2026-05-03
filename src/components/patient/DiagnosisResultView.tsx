"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ShieldAlert,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Stethoscope,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Download,
  Loader2,
  Coffee,
  Thermometer,
  Salad,
  Flame,
  FileText,
  Clock,
  TestTube2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Camera,
  LayoutDashboard,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DiagnosisChat } from "@/components/patient/DiagnosisChat"
import { DoctorMatch } from "@/components/patient/DoctorMatch"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Props {
  result: any
  sessionId: string | null
  existingMessages?: any[]
  onRestart: () => void
}

export function DiagnosisResultView({ result, sessionId, existingMessages = [], onRestart }: Props) {
  const [view, setView] = useState<"result" | "doctors">("result")
  const [currentSlide, setCurrentSlide] = useState(0)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (result) {
      toast.success("Diagnosis Generated", {
        description: `Severity detected: ${result.severity}. Review the details below.`,
      })
    }
    
    // Handle view query param for deep linking
    const viewParam = searchParams?.get("view")
    if (viewParam === "doctors") {
      setView("doctors")
    } else {
      setView("result")
    }
  }, [result, searchParams])

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary animate-pulse">
          <HeartPulse size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Preparing Clinical Summary</h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            Our AI is meticulously analyzing your symptoms and medical history. This will only take a moment.
          </p>
        </div>
        <Loader2 className="animate-spin text-primary mt-4" size={32} />
      </div>
    )
  }

  if (view === "doctors") {
    return <DoctorMatch specialty={result?.specialty || "Specialist"} onBack={() => setView("result")} initialDiagnosis={result} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestart}
              className="text-muted-foreground hover:text-primary -ml-3 gap-1.5 font-bold h-8"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="h-3 w-px bg-border hidden md:block" />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-primary gap-1.5 font-bold h-8"
            >
              <Link href="/dashboard">
                <LayoutDashboard size={16} />
                Home
              </Link>
            </Button>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              Clinical <span className="text-primary">Summary</span>
            </h2>
            <p className="text-muted-foreground font-medium text-xs">
              {result?.summary || "Generating summary..."}
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 w-fit mt-2">
              <Info size={12} className="text-primary animate-pulse" />
              <p className="text-[10px] font-black text-primary uppercase tracking-tight">
                Review all slides carefully for full clinical details
              </p>
            </div>
            <div className="hidden md:flex flex-wrap gap-2 pt-2">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Button
                  onClick={() => setView("doctors")}
                  className="h-8 px-4 bg-primary hover:bg-blue-600 text-white font-black rounded-lg shadow-lg shadow-primary/20 gap-2 text-[10px] border-0 transition-all active:scale-95 cursor-pointer"
                >
                  <div className="relative">
                    <Stethoscope size={14} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    </span>
                  </div>
                  Book Specialist
                </Button>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Button
                  asChild
                  className="h-8 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg shadow-lg shadow-emerald-500/20 gap-2 text-[10px] border-0 transition-all active:scale-95"
                >
                  <Link href={`/diagnose/${sessionId}/chat`} className="flex items-center gap-2">
                    <div className="relative">
                      <MessageSquare size={14} />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      </span>
                    </div>
                    <span>Chat with AI-Diagnose Companion</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`
            px-5 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-border shadow-sm
            ${result.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-600 border-red-500/20' : ''}
            ${result.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : ''}
            ${result.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : ''}
            ${result.severity === 'LOW' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}
          `}>
            {result?.severity} SEVERITY
          </div>

          {result.severityScore !== undefined && (
            <div className="flex items-center gap-3 bg-secondary/30 p-2 px-3 rounded-xl border border-border/50">
              <div className="space-y-0">
                <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Urgency</p>
                <p className="text-sm font-black text-foreground">{result.severityScore}<span className="text-[10px] text-muted-foreground ml-0.5">/100</span></p>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-secondary flex items-center justify-center relative">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="16" cy="16" r="14" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    className="text-primary"
                    strokeDasharray="87.92"
                    strokeDashoffset={87.92 - (87.92 * (result.severityScore || 0)) / 100}
                  />
                </svg>
                <TrendingUp size={10} className="absolute text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="relative group p-6 md:p-10 bg-background/60 dark:bg-slate-950/80 backdrop-blur-xl border-border shadow-2xl rounded-[2.5rem] overflow-visible transition-colors duration-500">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-blue-500/10 dark:from-primary/20 dark:to-blue-600/20 pointer-events-none rounded-[2.5rem]" />

          {/* Floating Navigation Arrows */}
          <div className="absolute inset-y-0 left-2 md:left-3 flex items-center z-50 pointer-events-none">
            <motion.button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              initial={{ opacity: 0.3 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              animate={currentSlide === 0 ? { opacity: 0, x: -20 } : {
                opacity: 0.4,
                x: [0, -4, 0],
                transition: { repeat: Infinity, duration: 3, repeatDelay: 1 }
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl flex items-center justify-center text-primary pointer-events-auto disabled:hidden"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>

          <div className="absolute inset-y-0 right-2 md:right-3 flex items-center z-50 pointer-events-none">
            <motion.button

              onClick={() => setCurrentSlide(prev => Math.min(5, prev + 1))}
              disabled={currentSlide === 5}
              initial={{ opacity: 0.3 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              animate={currentSlide === 5 ? { opacity: 0, x: 20 } : {
                opacity: 0.4,
                x: [0, 4, 0],
                transition: { repeat: Infinity, duration: 3, repeatDelay: 1 }
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl flex items-center justify-center text-primary pointer-events-auto disabled:hidden"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Clinical Stepper - Top Navigation */}
          <div className="mb-8 border-b border-border/50 pb-6 overflow-x-auto no-scrollbar">
            <div className="relative flex justify-between items-center min-w-[500px] md:min-w-0 md:w-full px-2">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-[20px] right-[20px] h-0.5 bg-border -translate-y-1/2 z-0" />
              {/* Active Progress Line */}
              <motion.div
                className="absolute top-1/2 left-[20px] h-0.5 bg-primary -translate-y-1/2 z-0"
                initial={false}
                animate={{
                  width: currentSlide === 0 ? 0 : `calc(${(currentSlide / 5) * 100}% - ${(currentSlide / 5) * 40}px)`
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {[
                { label: "Report", icon: HeartPulse },
                { label: "Visuals", icon: Camera },
                { label: "Safety", icon: AlertTriangle },
                { label: "Plan", icon: Clock },
                { label: "Care", icon: Salad },
                { label: "Hub", icon: Stethoscope }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-2 px-2">
                  <motion.button
                    onClick={() => setCurrentSlide(idx)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      backgroundColor: currentSlide >= idx ? 'var(--primary)' : 'transparent',
                      borderColor: currentSlide >= idx ? 'var(--primary)' : 'rgb(148, 163, 184, 0.3)',
                      color: currentSlide >= idx ? 'white' : 'rgb(148, 163, 184)',
                      boxShadow: currentSlide === idx ? '0 0 20px rgba(var(--primary-rgb), 0.5)' : 'none'
                    }}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer`}
                  >
                    <step.icon size={currentSlide === idx ? 20 : 16} className="transition-all" />
                  </motion.button>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer ${currentSlide === idx ? 'text-primary scale-110' : 'text-muted-foreground/60'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="space-y-4"
              >
                {/* Slide 1: Diagnosis Overview */}
                {currentSlide === 0 && (
                  <div className="space-y-4">
                    <Card className="p-5 bg-card/80 dark:bg-slate-900/90 border-border dark:border-primary/20 shadow-lg rounded-2xl space-y-4 border-l-4 border-l-primary relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none text-primary">
                        <HeartPulse size={120} />
                      </div>
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-2 text-primary">
                          <HeartPulse size={18} />
                          <h4 className="text-sm font-black uppercase tracking-tight">Clinical Diagnosis</h4>
                        </div>
                        <p className="text-muted-foreground dark:text-slate-300 leading-relaxed text-sm font-medium italic border-l-2 border-primary/20 pl-4">
                          "{result?.explanation}"
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground dark:text-slate-400 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              Possible Conditions
                            </h4>
                            <div className="grid gap-1.5">
                              {result?.possibleConditions?.map((cond: string, idx: number) => (
                                <div key={`cond-${idx}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 dark:bg-primary/20 border border-primary/10 dark:border-primary/30 text-xs font-bold text-foreground dark:text-slate-200">
                                  {cond}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground dark:text-slate-400 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Precautions
                            </h4>
                            <div className="grid gap-1.5">
                              {result?.precautions?.map((prec: string, idx: number) => (
                                <div key={`prec-${idx}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/20 border border-emerald-500/10 dark:border-emerald-500/30 text-[11px] font-bold text-muted-foreground dark:text-emerald-50">
                                  <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                  {prec}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Slide 2: Visual Analysis Report */}
                {currentSlide === 1 && (
                  <div className="space-y-4">
                    {result.imageAnalysis ? (
                      <Card className="p-6 bg-card/80 dark:bg-slate-900/90 border-border dark:border-blue-500/20 shadow-lg rounded-2xl space-y-5 border-l-4 border-l-blue-500 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none text-blue-500">
                          <Camera size={140} />
                        </div>
                        <div className="flex items-center gap-4 text-blue-500 relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Camera size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase tracking-tighter">Visual Synthesis</h4>
                            <p className="text-[9px] font-black text-muted-foreground dark:text-slate-400 uppercase tracking-widest">AI Computer Vision Active</p>
                          </div>
                        </div>
                        <div className="p-6 rounded-xl bg-blue-500/5 dark:bg-blue-500/20 border border-blue-500/10 dark:border-blue-500/40 relative z-10">
                          <p className="text-sm font-bold text-foreground dark:text-slate-200 leading-relaxed italic">
                            "{result.imageAnalysis}"
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-500/60 font-bold text-[9px] uppercase tracking-widest relative z-10">
                          <ShieldAlert size={12} />
                          Cross-referenced with symptoms
                        </div>
                      </Card>
                    ) : (
                      <Card className="p-8 bg-secondary/10 border-border border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                        <Camera size={32} className="text-muted-foreground/20" />
                        <div className="space-y-0.5">
                          <h4 className="text-base font-black text-muted-foreground/50 uppercase">No Visual Data</h4>
                          <p className="text-[10px] font-bold text-muted-foreground/30">Assessment based on textual input only.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setCurrentSlide(prev => prev + 1)} className="rounded-lg font-black uppercase text-[10px] tracking-widest h-8">
                          Continue
                        </Button>
                      </Card>
                    )}
                  </div>
                )}

                {/* Slide 3: Safety & Urgency */}
                {currentSlide === 2 && (
                  <div className="space-y-5">
                    {result?.redFlags && result.redFlags.length > 0 && (
                      <Card className="p-6 rounded-2xl bg-red-600/10 dark:bg-red-500/5 border border-red-500/20 dark:border-red-500/30 space-y-4 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 opacity-[0.05] text-red-600">
                          <AlertTriangle size={160} />
                        </div>
                        <div className="flex items-center gap-3 text-red-600 relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                            <AlertTriangle size={20} className="animate-bounce" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase tracking-tighter">Emergency Red Flags</h4>
                            <p className="text-[9px] font-black text-red-600/80 uppercase tracking-widest">Immediate Medical Attention May Be Required</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
                          {result.redFlags.map((flag: string, idx: number) => (
                            <div key={`flag-${idx}`} className="flex items-center gap-2 p-3 rounded-xl bg-white/60 dark:bg-red-600/20 border border-red-500/20 dark:border-red-500/40 text-xs font-black text-red-700 dark:text-red-50 shadow-sm hover:scale-[1.02] transition-transform">
                              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                              {flag}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {result.medicationSafetyWarning && (
                      <Card className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-500/50 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                          <AlertCircle size={20} />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-black uppercase tracking-tight text-amber-600 dark:text-amber-400">Medication Safety</h5>
                          <p className="text-xs font-bold text-amber-700/80 dark:text-amber-100 leading-relaxed italic">{result.medicationSafetyWarning}</p>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Slide 4: Recovery & Plan */}
                {currentSlide === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-5">
                      <Card className="p-6 bg-primary/5 dark:bg-slate-900/90 border-border dark:border-primary/20 shadow-lg rounded-2xl space-y-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                          <Clock size={24} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Recovery Timeline</span>
                          <h4 className="text-xl font-black text-foreground dark:text-slate-100 tracking-tight">{result.recoveryTimeline}</h4>
                        </div>
                      </Card>

                      <Card className="p-6 bg-blue-500/5 dark:bg-slate-900/90 border-border dark:border-blue-500/20 shadow-lg rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-blue-500">
                          <TestTube2 size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Investigations</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {result.recommendedTests?.map((test: string, idx: number) => (
                            <div key={`test-${idx}`} className="p-3 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/40 text-xs font-black text-blue-700 dark:text-blue-300 flex items-center justify-between hover:bg-blue-500/30 transition-all">
                              {test}
                              <ChevronRight size={12} className="opacity-40" />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    <Card className="p-6 bg-card/80 dark:bg-slate-900/90 border-border dark:border-white/5 rounded-2xl space-y-5 shadow-lg">
                      <div className="flex items-center gap-2 text-foreground">
                        <TrendingUp size={18} />
                        <h4 className="text-[11px] font-black uppercase tracking-widest dark:text-slate-400">Next Clinical Steps</h4>
                      </div>
                      <ul className="space-y-4">
                        {result?.nextSteps?.map((step: string, i: number) => (
                          <li key={`step-${i}`} className="flex items-start gap-3 group">
                            <div className="w-7 h-7 rounded-lg bg-secondary dark:bg-slate-800 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                              {i + 1}
                            </div>
                            <p className="text-[11px] font-bold text-foreground dark:text-slate-200 leading-relaxed pt-1">{step}</p>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}

                {/* Slide 5: Self-Care */}
                {currentSlide === 4 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Card className="p-5 bg-orange-500/5 dark:bg-slate-900/90 border-orange-500/10 dark:border-orange-500/30 shadow-lg rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-orange-500">
                          <Flame size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Immediate Relief</span>
                        </div>
                        <div className="space-y-2">
                          {result?.temporaryRelief?.map((item: string, i: number) => (
                            <div key={`relief-${i}`} className="flex gap-3 p-3 rounded-xl bg-card dark:bg-orange-950/40 border border-orange-500/10 dark:border-orange-500/20 text-xs font-bold text-foreground dark:text-slate-200 leading-relaxed">
                              <span className="text-orange-500">•</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="p-5 bg-emerald-500/5 dark:bg-slate-900/90 border-emerald-500/10 dark:border-emerald-500/30 shadow-lg rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500">
                          <Salad size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Dietary Advice</span>
                        </div>
                        <div className="space-y-2">
                          {result?.dietaryAdvice?.map((item: string, i: number) => (
                            <div key={`diet-${i}`} className="flex gap-3 p-3 rounded-xl bg-card dark:bg-emerald-950/40 border border-emerald-500/10 dark:border-emerald-500/20 text-xs font-bold text-foreground dark:text-slate-200 leading-relaxed">
                              <span className="text-emerald-500">•</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-secondary/40 to-primary/5 dark:from-slate-900 dark:to-slate-950 border-border dark:border-white/5 shadow-xl rounded-2xl">
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 text-primary">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Coffee size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase tracking-tight dark:text-slate-100">Home Remedies</h4>
                            <p className="text-[9px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-widest">Supportive Care</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {result?.homeRemedies?.map((remedy: string, i: number) => (
                            <div key={`remedy-${i}`} className="p-4 rounded-xl bg-card dark:bg-slate-800/80 border border-border dark:border-white/5 shadow-md flex flex-col gap-1.5 hover:scale-105 transition-all group cursor-pointer">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                {i + 1}
                              </div>
                              <p className="text-xs font-black text-foreground dark:text-slate-200 leading-tight">{remedy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Slide 6: Medical Pro */}
                {currentSlide === 5 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      <Card className="lg:col-span-1 p-6 bg-primary dark:bg-primary text-white rounded-2xl shadow-xl border-0 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-4">
                          <div className="space-y-1.5">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white mb-2 shadow-lg">
                              <Stethoscope size={24} />
                            </div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/70">Recommended Specialty</p>
                            <h3 className="text-xl font-black tracking-tight">{result?.specialty}</h3>
                          </div>

                          <p className="text-xs font-bold text-white/80 leading-relaxed">
                            Find rated {result?.specialty} specialists in your area.
                          </p>
                        </div>

                        <div className="relative z-10 space-y-2 pt-6">
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Button
                              onClick={() => setView("doctors")}
                              className="w-full h-10 bg-white text-primary hover:bg-slate-50 font-black rounded-xl shadow-xl shadow-primary/20 transition-all text-xs cursor-pointer group"
                            >
                              <Stethoscope size={16} className="mr-2 group-hover:rotate-12 transition-transform" />
                              Book rated {result?.specialty}
                              <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                          <Button
                            variant="outline"
                            asChild
                            className="w-full h-10 border-white/30 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl gap-2 text-xs backdrop-blur-md cursor-pointer"
                          >
                            <Link href={`/diagnose/${sessionId}/chat`}>
                              <MessageSquare size={16} />
                              AI Chat
                            </Link>
                          </Button>
                        </div>
                      </Card>

                      <div className="lg:col-span-2 space-y-5">
                        <Card className="p-6 bg-secondary/20 dark:bg-slate-900/50 border-2 border-dashed border-border rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                            <FileText size={120} />
                          </div>
                          <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-primary border border-border/50">
                                  <FileText size={20} />
                                </div>
                                <div>
                                  <h4 className="text-base font-black uppercase tracking-tight text-foreground">Note for Specialist</h4>
                                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Clinical Synthesis
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                                <Download size={18} />
                              </Button>
                            </div>

                            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-border shadow-xl font-mono text-[11px] leading-relaxed text-slate-900 dark:text-slate-100 backdrop-blur-md relative group">
                              <div className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500/30 group-hover:text-primary transition-colors">
                                Official Record
                              </div>
                              {result.doctorNote}
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-card border-border rounded-2xl space-y-4 shadow-lg">
                          <div className="flex items-center gap-2 text-primary">
                            <HelpCircle size={20} />
                            <h4 className="text-sm font-black uppercase tracking-tight">Doctor Questions</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result?.questionsForDoctor?.map((q: string, i: number) => (
                              <div key={`q-${i}`} className="p-4 rounded-xl bg-primary/5 dark:bg-slate-900 border border-border flex items-start gap-3 hover:border-primary/20 transition-all group">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <p className="text-[11px] font-bold text-foreground leading-relaxed italic">"{q}"</p>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>



      </div>

      {/* Primary Navigation Controls */}
      <div className="hidden md:flex flex-col items-center gap-6 mt-8">
        <div className="flex items-center justify-between w-full max-w-lg bg-card/40 dark:bg-slate-900/40 backdrop-blur-xl p-2 rounded-2xl border border-border/50 shadow-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="text-[10px] font-black uppercase tracking-[0.1em] h-10 px-6 rounded-xl hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-20"
          >
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {currentSlide + 1} <span className="text-primary/30 mx-1">/</span> 6
              </span>
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => setCurrentSlide(prev => Math.min(5, prev + 1))}
            disabled={currentSlide === 5}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-[0.1em] h-10 px-8 rounded-xl transition-all disabled:opacity-20"
          >
            {currentSlide === 5 ? "Complete" : "Next Detail"}
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="p-5 mt-6 rounded-xl bg-secondary/10 border border-border text-center backdrop-blur-md">
        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
          Disclaimer: This AI analysis is for informational triage purposes only. It is not a clinical diagnosis. In case of emergency, please call 911 or visit the nearest ER.
        </p>
      </div>

      {/* Floating Action Buttons for Mobile */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-4 md:hidden">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
             <Link href={`/diagnose/${sessionId}/chat`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center relative group"
              >
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </span>
                <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                  AI Chat
                </span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setView("doctors")}
              className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center relative group"
            >
              <Stethoscope size={24} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              </span>
              <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                Book Doctor
              </span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
