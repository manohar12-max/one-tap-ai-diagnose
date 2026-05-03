"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Activity, Loader2, MessageSquare, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments")
      if (res.ok) {
        const data = await res.json()
        setAppointments(data)
      }
    } catch (error) {
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Clinical <span className="text-primary">Queue</span>
          </h1>
          <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
            Review and manage incoming consultation requests
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="secondary" className="px-4 py-2 rounded-xl bg-secondary/50 font-black uppercase tracking-widest text-[10px]">
            {appointments.length} Total Requests
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={48} className="animate-spin text-primary/20" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 bg-secondary/10">
          <div className="w-20 h-20 bg-secondary/50 rounded-3xl flex items-center justify-center text-muted-foreground mb-4 shadow-inner">
            <Calendar size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-widest text-foreground">Queue is clear</h2>
            <p className="text-muted-foreground max-w-md font-medium text-sm">New patient requests will appear here once they book through the clinical portal.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {appointments.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                onClick={() => router.push(`/staff/appointments/${app.id}`)}
                className="p-8 bg-card/40 border-border hover:border-primary/30 transition-all rounded-[2.5rem] shadow-xl group cursor-pointer relative overflow-hidden"
              >
                {app.severity === 'CRITICAL' && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full flex items-start justify-end p-4">
                    <Activity size={24} className="text-red-500 animate-pulse" />
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${
                      app.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {app.patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{app.patient.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-0.5 rounded-full font-black uppercase tracking-widest text-[8px] ${
                          app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                          app.status === 'INVITED' ? 'bg-primary/10 text-primary' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-2xl border border-border/50">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Chief Complaint</p>
                      <p className="text-xs font-bold text-foreground line-clamp-2 italic">"{app.symptoms}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-primary group-hover:translate-x-1 transition-transform">
                        View Details <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
