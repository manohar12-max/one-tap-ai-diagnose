"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, AlertCircle, CheckCircle2, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: {
    id: string
    name: string
    specialty: string
    image: string
  }
  initialDiagnosis?: {
    summary: string
    explanation: string
    severity: string
    doctorNote?: string
  }
}

export function BookingModal({ isOpen, onClose, doctor, initialDiagnosis }: BookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [symptoms, setSymptoms] = useState(initialDiagnosis ? "" : "")

  const handleBook = async () => {
    setLoading(true)
    try {
      // Get AI diagnosis from localStorage if available
      const lastDiagnosis = JSON.parse(localStorage.getItem("last_diagnosis") || "{}")
      
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor.id,
          symptoms: symptoms || (initialDiagnosis ? "Consultation for " + initialDiagnosis.summary : "Initial consultation request"),
          aiDiagnosis: initialDiagnosis?.explanation || lastDiagnosis.summary || "No recent AI diagnosis found",
          severity: initialDiagnosis?.severity || lastDiagnosis.severity || "LOW",
        }),
      })

      if (res.ok) {
        setSuccess(true)
        toast.success("Appointment request sent successfully!")
        setTimeout(() => {
          onClose()
          setSuccess(false)
        }, 2000)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to book appointment")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                    Book <span className="text-primary">Consultation</span>
                  </h2>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Request an appointment with {doctor.name}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>

              {!success ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-3xl border border-border">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-foreground">{doctor.name}</h4>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">{doctor.specialty}</p>
                    </div>
                  </div>

                  {!initialDiagnosis ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                        Briefly describe your symptoms
                      </label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="e.g. Mild fever and headache since morning..."
                        className="w-full h-32 bg-secondary/30 border border-border rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <FileText size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Report Attached</span>
                      </div>
                      <p className="text-xs font-bold text-foreground leading-relaxed line-clamp-3 italic">
                        "{initialDiagnosis.summary}"
                      </p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        Patient history and analysis will be shared with {doctor.name}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <AlertCircle size={18} className="text-primary shrink-0" />
                    <p className="text-[10px] font-bold text-primary/80 uppercase leading-relaxed">
                      Your recent AI diagnosis data will be shared with the doctor to provide better context.
                    </p>
                  </div>

                  <Button
                    onClick={handleBook}
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm gap-2 shadow-lg shadow-primary/20"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
                    Request Appointment
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground">Request Sent!</h3>
                    <p className="text-muted-foreground font-medium">
                      Doctor will review your request and confirm a slot shortly.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
