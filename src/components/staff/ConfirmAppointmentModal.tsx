"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ConfirmAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (date: string, time: string) => Promise<void>
  patientName: string
}

export function ConfirmAppointmentModal({ isOpen, onClose, onConfirm, patientName }: ConfirmAppointmentModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState("10:00 AM")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm(date, time)
    setLoading(false)
    onClose()
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
            className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">
                    Confirm <span className="text-primary">Appointment</span>
                  </h2>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Set schedule for {patientName}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={12} className="text-primary" />
                    Appointment Date
                  </label>
                  <Input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/30 border-border font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Clock size={12} className="text-primary" />
                    Time Slot
                  </label>
                  <Input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/30 border-border font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleConfirm}
                    disabled={loading || !date || !time}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm gap-2 shadow-lg shadow-primary/20"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Confirm Schedule
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
