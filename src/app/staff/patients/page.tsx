"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Search, 
  Filter, 
  Loader2, 
  Activity, 
  Calendar, 
  ChevronRight,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  History,
  ArrowUpDown
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { useRouter } from "next/navigation"

export default function PatientVaultPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/staff/patients", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPatients(data)
      }
    } catch (error) {
      toast.error("Failed to load patient records")
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mobile.includes(searchQuery)
  )

  return (
    <div className="space-y-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Patient <span className="text-primary">Vault</span>
          </h1>
          <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
            Centralized clinical database and medical histories
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by name, email, or mobile..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-secondary/30 border-border rounded-xl focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-xl border-border p-0">
            <Filter size={20} />
          </Button>
        </div>
      </div>

      <div className="max-w-5xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={48} className="animate-spin text-primary/20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Database...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 bg-secondary/10">
            <div className="w-20 h-20 bg-secondary/50 rounded-3xl flex items-center justify-center text-muted-foreground shadow-inner">
              <Users size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-widest text-foreground">No Records Found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm">Your patient database will grow as you complete clinical consultations.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient, i) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  onClick={() => router.push(`/staff/patients/${patient.id}`)}
                  className="p-6 bg-card/40 border-border hover:border-primary/30 transition-all rounded-[2.5rem] cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center font-black text-2xl shadow-inner text-primary group-hover:scale-105 transition-transform">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{patient.name}</h3>
                        <div className="flex items-center gap-4 pt-1">
                          <span className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">{patient.age}Y • {patient.gender}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                          <span className="text-[11px] font-black uppercase text-primary tracking-widest">{patient.bloodGroup}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                          <span className="text-[11px] font-black uppercase text-muted-foreground tracking-widest">{patient.visitCount} VISITS</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                      <div className="hidden lg:block text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Latest Insight</p>
                        <p className="text-xs font-bold text-foreground italic truncate max-w-[200px]">"{patient.recentDiagnosis}"</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
