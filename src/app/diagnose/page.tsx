"use client"

import { Navbar } from "../../components/Navbar"
import { DiagnosisWizard } from "@/components/patient/DiagnosisWizard"
import { motion } from "framer-motion"
import { ShieldCheck, Brain, Activity } from "lucide-react"

export default function TriagePage() {
  return (
    <div className="min-h-screen bg-transparent relative pb-20">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 space-y-12 relative z-10">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            <Brain size={14} className="animate-pulse" />
            AI Consultation Mode Active
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
          >
            Clinical <span className="text-primary">Triage</span> Intelligence
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto"
          >
            Describe your symptoms in detail. Our AI will analyze your condition and provide immediate clinical guidance and severity assessment.
          </motion.p>
        </div>

        {/* Diagnosis Wizard Component */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DiagnosisWizard />
        </motion.div>

        {/* Footer info for confidence */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border mt-12"
        >
           <div className="flex items-center gap-4 text-muted-foreground">
             <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
               <ShieldCheck size={20} />
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest">Privacy First</p>
               <p className="text-xs font-bold">HIPAA Compliant Data Handling</p>
             </div>
           </div>
           
           <div className="flex items-center gap-4 text-muted-foreground">
             <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
               <Activity size={20} />
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest">Real-time Analysis</p>
               <p className="text-xs font-bold">Instant Severity Assessment</p>
             </div>
           </div>

           <div className="flex items-center gap-4 text-muted-foreground">
             <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-primary">
               <Brain size={20} />
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest">Expert Logic</p>
               <p className="text-xs font-bold">Clinical Specialization matching</p>
             </div>
           </div>
        </motion.div>
      </main>
    </div>
  )
}
