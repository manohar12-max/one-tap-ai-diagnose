"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Activity,
  ChevronRight,
  Loader2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

export default function TriageQueuePage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTriageQueue()
  }, [])

  const fetchTriageQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/staff/triage")
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      }
    } catch (err) {
      toast.error("Failed to load triage queue")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground uppercase leading-tight">
            Triage <span className="text-primary">Queue</span>
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
            {sessions.length} Incoming diagnostic requests
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl font-bold gap-2 h-11 border-border bg-card/50">
            <Filter size={16} />
            Filters
          </Button>
          <Button onClick={fetchTriageQueue} disabled={loading} className="rounded-xl font-black gap-2 h-11 bg-primary text-white shadow-lg shadow-primary/20">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
            Refresh Live
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-card/50 rounded-2xl animate-pulse border border-border" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-20 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4 bg-card/30">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/30">
            <ClipboardList size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">No pending requests</h3>
            <p className="text-muted-foreground/60 max-w-md font-medium">New diagnostic sessions requiring clinical review will appear here in real-time.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {sessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  onClick={() => router.push(`/staff/triage-queue/${session.id}`)}
                  className="p-6 bg-card/50 hover:bg-card border-border hover:border-primary/30 transition-all cursor-pointer rounded-[2rem] group shadow-sm hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-inner">
                        <UserIcon size={32} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{session.user?.name}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase font-black border-border">
                            {session.user?.age}Y • {session.user?.gender}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {session.symptoms?.slice(0, 3).map((s: string) => (
                            <span key={s} className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                              {s}
                            </span>
                          ))}
                          {session.symptoms?.length > 3 && (
                            <span className="text-[11px] font-black text-primary/60">+{session.symptoms.length - 3} MORE</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10 w-full md:w-auto">
                      <div className="hidden lg:flex flex-col items-end gap-2">
                         <div className="flex items-center gap-2">
                           <Badge className={`font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${getSeverityColor(session.diagnosis?.severity)}`}>
                             {session.diagnosis?.severity || 'PENDING'}
                           </Badge>
                           {session.appointment?.[0] && (
                             <Badge variant="outline" className={`font-black text-[10px] uppercase tracking-[0.1em] border-primary/20 text-primary bg-primary/5`}>
                               {session.appointment[0].status.replace('_', ' ')}
                             </Badge>
                           )}
                         </div>
                         <p className="text-[10px] font-black text-muted-foreground mt-1 flex items-center gap-1.5 uppercase tracking-widest">
                           <Clock size={12} />
                           {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-xl shadow-primary/20 gap-3 uppercase tracking-widest">
                          Review Case
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
