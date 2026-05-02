"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  AlertCircle
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StaffDashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(userData)
  }, [])

  const stats = [
    { label: "Total Patients", value: "128", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Triage", value: "14", icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-500/10", urgent: true },
    { label: "Today's Appointments", value: "8", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Triage Time", value: "4m", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Clinical <span className="text-primary">Overview</span>
          </h1>
          <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
            Welcome back, {user?.role === 'DOCTOR' ? 'Dr. ' : ''}{user?.name || 'Staff Member'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/50 px-4 py-2 rounded-full border border-border">
          <Activity size={14} className="text-primary animate-pulse" />
          System Live
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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
                    <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                    {stat.urgent && (
                      <Badge variant="destructive" className="animate-bounce h-5 px-1.5 text-[8px] font-black uppercase">Urgent</Badge>
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
        {/* Main Feed - Triage Queue Preview */}
        <Card className="lg:col-span-2 p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight">Recent Triage Requests</h2>
            <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">View All Queue</button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="group flex items-center justify-between p-5 rounded-3xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm uppercase">Potential Chest Infection</h3>
                    <p className="text-xs text-muted-foreground font-medium">Patient: Rohan Sharma • 28y • Male</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] font-black uppercase">Critical</Badge>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">12 mins ago</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sidebar Analytics */}
        <Card className="p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight">Insights</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Real-time stats</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black uppercase tracking-widest">Triage Accuracy</p>
                <p className="text-xl font-black text-emerald-500">94%</p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black uppercase tracking-widest">Consultation Volume</p>
                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp size={14} />
                  <p className="text-xl font-black">+12%</p>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-auto">
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Doctor Tip</p>
              <p className="text-xs font-bold text-foreground leading-relaxed">
                Check the "Critical" triage queue every 15 minutes to maintain high response rates.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
