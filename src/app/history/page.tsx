"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  History, 
  Search, 
  Filter, 
  ChevronRight, 
  Stethoscope, 
  AlertCircle,
  Calendar,
  ArrowLeft,
  Clock
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ClinicalHistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history")
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const filteredHistory = history.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.diagnosis?.specialty?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-transparent relative pb-20">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-24 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
               <History size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Records</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Diagnostic <span className="text-primary">History</span></h1>
            <p className="text-muted-foreground text-sm font-medium">Access your previous AI assessments and clinical chats.</p>
          </div>
          
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 font-bold text-muted-foreground hover:text-primary">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search diagnoses, symptoms, or specialties..." 
              className="pl-12 h-12 bg-card/50 border-border rounded-2xl font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-border gap-2 font-bold">
            <Filter size={18} />
            Filter
          </Button>
        </div>

        {/* History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-48 animate-pulse bg-card/50 border-border rounded-3xl" />
            ))
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/diagnose/${item.id}`}>
                  <Card className="p-6 bg-card/40 border-border backdrop-blur-xl hover:border-primary/40 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                       <Badge variant="outline" className={cn(
                          "text-[9px] font-black tracking-widest uppercase border-0",
                          item.diagnosis?.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 
                          item.diagnosis?.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-emerald-500/10 text-emerald-500'
                       )}>
                         {item.diagnosis?.severity || 'LOW'}
                       </Badge>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {item.diagnosis?.severity === 'CRITICAL' ? <AlertCircle size={20} /> : <Stethoscope size={20} />}
                      </div>
                      
                      <div className="space-y-1.5">
                        <h3 className="font-black text-lg text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {item.title || "Untitled Assessment"}
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                           <span className="flex items-center gap-1"><Clock size={10} /> {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                       <div className="space-y-0.5">
                         <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Clinical Specialty</p>
                         <p className="text-xs font-bold text-primary">{item.diagnosis?.specialty}</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                         <ChevronRight size={16} />
                       </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                 <History size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-foreground">No records found</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                  Try searching for a different term or start a new diagnosis session.
                </p>
              </div>
              <Link href="/diagnose">
                <Button className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold">Start New Assessment</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
