import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Clock, User, AlertCircle, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TriagePage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { patient: true }
  })

  const stats = {
    critical: appointments.filter((a: any) => a.severity === 'CRITICAL').length,
    high: appointments.filter((a: any) => a.severity === 'HIGH').length,
    pending: appointments.filter((a: any) => a.status === 'PENDING').length
  }

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-50">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest mb-2">
            <Activity size={14} />
            Clinical Staff Access
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Clinical Triage Hub</h1>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Real-time patient monitoring prioritized by AI Severity Score. Review cases and initiate consultations.
          </p>
        </div>
        <div className="flex gap-4">
           <Card className="bg-red-500/10 border-red-500/20 px-6 py-3 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                <AlertCircle className="text-red-500" size={20} />
             </div>
             <div>
               <p className="text-[10px] uppercase font-bold text-red-500/70 tracking-widest">Critical</p>
               <p className="text-2xl font-bold leading-none">{stats.critical}</p>
             </div>
           </Card>
           <Card className="bg-indigo-500/10 border-indigo-500/20 px-6 py-3 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Activity className="text-indigo-500" size={20} />
             </div>
             <div>
               <p className="text-[10px] uppercase font-bold text-indigo-500/70 tracking-widest">Active Cases</p>
               <p className="text-2xl font-bold leading-none">{stats.pending}</p>
             </div>
           </Card>
        </div>
      </header>

      <Card className="bg-slate-900/40 border-slate-800 overflow-hidden backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-slate-900/60">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider h-12">Patient</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider h-12">AI Severity</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider h-12">Reported Symptoms</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider h-12">Specialty Suggestion</TableHead>
              <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-wider h-12">Time Received</TableHead>
              <TableHead className="text-right text-slate-400 font-bold uppercase text-[10px] tracking-wider h-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-60 text-center text-slate-500">
                   <div className="flex flex-col items-center gap-2">
                     <Activity size={32} className="text-slate-800" />
                     <p>No active triage cases in the queue.</p>
                   </div>
                 </TableCell>
               </TableRow>
            ) : (
              appointments.map((apt: any) => (
                <TableRow key={apt.id} className="border-slate-800 hover:bg-slate-800/40 transition-all group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
                        <User size={16} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{apt.patient.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{apt.patient.id.slice(-6)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      px-3 py-1 text-[10px] font-black uppercase
                      ${apt.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/50 text-red-500' : ''}
                      ${apt.severity === 'HIGH' ? 'bg-orange-500/10 border-orange-500/50 text-orange-500' : ''}
                      ${apt.severity === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : ''}
                      ${apt.severity === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : ''}
                    `}>
                      {apt.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-slate-400 text-xs italic">
                    "{apt.symptoms}"
                  </TableCell>
                  <TableCell>
                    <span className="text-indigo-400 text-xs font-bold px-2 py-1 bg-indigo-500/5 rounded border border-indigo-500/10">
                      {JSON.parse(apt.aiDiagnosis).specialty}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-600" />
                      {new Date(apt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-indigo-400 hover:text-white transition-colors">
                      Assess Case
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
