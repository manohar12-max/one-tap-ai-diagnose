"use client"

export default function AnalyticsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
        Clinical <span className="text-primary">Analytics</span>
      </h1>
      <div className="p-12 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-muted-foreground text-lg font-bold uppercase tracking-widest">Aggregating performance data</div>
        <p className="text-muted-foreground/60 max-w-md">Insights regarding patient triage accuracy, consultation volume, and recovery trends will be visualized here.</p>
      </div>
    </div>
  )
}
