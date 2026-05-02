"use client"

export default function PatientsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
        Patient <span className="text-primary">Vault</span>
      </h1>
      <div className="p-12 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-muted-foreground text-lg font-bold uppercase tracking-widest">Your patient database is being synced</div>
        <p className="text-muted-foreground/60 max-w-md">Once patients book appointments or complete triage with you, their medical records will be securely accessible here.</p>
      </div>
    </div>
  )
}
