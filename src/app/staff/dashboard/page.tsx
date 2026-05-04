"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Settings,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSocket } from "@/lib/socket"
import Link from "next/link"

export default function StaffDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [attentionNeeded, setAttentionNeeded] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/staff/overview", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setAttentionNeeded(data.attentionNeeded)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
    fetchDashboardData()

    // Socket Integration
    let socketInstance: any = null
    const setupSocket = async () => {
      try {
        socketInstance = await getSocket()
        if (socketInstance) {
          console.log("[Dashboard] Socket connected, joining room:", `doctor-${userData.userId}`)
          socketInstance.emit("join-room", `doctor-${userData.userId}`)
          
          // Listen for updates in the doctor's room
          socketInstance.on("new-message", (msg: any) => {
            console.log("[Dashboard] New message received, refreshing data...")
            fetchDashboardData()
          })

          socketInstance.on("new-appointment", (appt: any) => {
            console.log("[Dashboard] New appointment received, refreshing data...")
            fetchDashboardData()
          })
        }
      } catch (err) {
        console.error("[Dashboard] Socket setup failed:", err)
      }
    }

    setupSocket()

    return () => {
      if (socketInstance) {
        socketInstance.off("new-message")
        socketInstance.off("new-appointment")
      }
    }
  }, [fetchDashboardData])

  const statCards = [
    { label: "Total Patients", value: stats?.totalPatients || "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Triage", value: stats?.pendingTriage || "0", icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-500/10", urgent: (stats?.pendingTriage > 0) },
    { label: "Today's Appts", value: stats?.todayAppointments || "0", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Triage", value: stats?.avgTriageTime || "4m", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground uppercase leading-tight">
            Clinical <span className="text-primary">Overview</span>
          </h1>
          <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
            Welcome back, {user?.role === 'DOCTOR' ? 'Dr. ' : ''}{user?.name || 'Staff Member'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={user?.isDetailsFilled ? "/staff/settings" : "/onboarding"}>
            <Button variant="outline" className={cn(
              "rounded-2xl h-12 px-6 border-border bg-card/50 backdrop-blur-sm font-bold text-xs tracking-widest uppercase relative",
              !user?.isDetailsFilled && "border-red-500/50 text-red-500 hover:text-red-600 hover:bg-red-500/5"
            )}>
              <Settings size={18} className={cn("mr-2", !user?.isDetailsFilled && "animate-spin-slow")} />
              {user?.isDetailsFilled ? "Profile Settings" : "Complete Profile"}
              {user?.isDetailsFilled && <CheckCircle2 size={16} className="ml-2 text-emerald-500" />}
              
              {!user?.isDetailsFilled && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center">
                    <AlertCircle size={10} className="text-white" />
                  </span>
                </span>
              )}
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <Activity size={14} className="text-primary animate-pulse" />
            Real-time Engine Active
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 bg-card/40 border-border backdrop-blur-xl rounded-[2rem] hover:border-primary/30 transition-all group overflow-hidden relative">
              <div className={stat.bg + " absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] -z-10 opacity-50 group-hover:scale-110 transition-transform"} />
              <div className="space-y-4">
                <div className={stat.color + " w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner"}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-black tracking-tight">
                      {loading ? "..." : stat.value}
                    </p>
                    {stat.urgent && (
                      <Badge variant="destructive" className="animate-bounce h-5 px-1.5 text-[8px] font-black uppercase">Action</Badge>
                    )}
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed - Attention Needed */}
        <Card className="lg:col-span-2 p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">Requires Attention</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                {attentionNeeded.length} bookings need your review
              </p>
            </div>
            <Link href="/staff/appointments" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline flex items-center gap-1">
              All Bookings <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-4 min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground animate-pulse">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Syncing Clinical Data...</p>
              </div>
            ) : attentionNeeded.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground bg-secondary/20 rounded-[2rem] border border-dashed border-border">
                <ClipboardList size={48} className="mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Queue is Clear</p>
                <p className="text-[10px] mt-2 font-medium">All patients have been attended to.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {attentionNeeded.map((appt, i) => (
                  <motion.div 
                    key={appt.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <Link href={`/staff/appointments?id=${appt.id}`}>
                      <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer ${
                        appt.needsResponse 
                          ? "bg-primary/5 border-primary/20 hover:border-primary/40" 
                          : "bg-secondary/30 border-border/50 hover:border-primary/20"
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${
                            appt.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                            appt.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            {appt.needsResponse ? <MessageSquare size={24} className="animate-pulse" /> : <AlertCircle size={24} />}
                            {appt.needsResponse && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground text-sm uppercase truncate max-w-[200px]">
                              {appt.patient?.name || "Anonymous Patient"}
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                              {appt.symptoms.substring(0, 40)}{appt.symptoms.length > 40 ? '...' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden md:block text-right">
                            <Badge className={`${
                              appt.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              appt.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                              'bg-secondary text-muted-foreground'
                            } text-[8px] font-black uppercase`}>
                              {appt.severity}
                            </Badge>
                            <p className="text-[8px] text-muted-foreground font-black mt-1 uppercase tracking-tighter">
                              {appt.needsResponse ? "Reply Needed" : appt.status.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowUpRight size={20} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </Card>

        {/* Sidebar Analytics */}
        <Card className="p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight">Clinical Insights</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Efficiency Metrics</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-widest">Triage Completion</p>
                <p className="text-xl font-black text-emerald-500">
                  {stats ? Math.round(((stats.totalPatients - stats.pendingTriage) / stats.totalPatients) * 100) || 100 : 0}%
                </p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stats ? `${((stats.totalPatients - stats.pendingTriage) / stats.totalPatients) * 100 || 100}%` : "0%" }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-widest">Today's Load</p>
                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp size={14} />
                  <p className="text-xl font-black">{stats?.todayAppointments || 0}</p>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stats ? `${Math.min((stats.todayAppointments / 10) * 100, 100)}%` : "0%" }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-auto">
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-primary" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Real-time Alert</p>
              </div>
              <p className="text-[11px] font-bold text-foreground leading-relaxed">
                {stats?.pendingTriage > 5 
                  ? "High volume of pending triage. Consider prioritizing critical cases."
                  : "Queue is stable. You can proceed with standard consultations."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
