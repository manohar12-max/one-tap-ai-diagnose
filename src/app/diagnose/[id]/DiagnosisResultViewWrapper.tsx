"use client"

import { DiagnosisResultView } from "@/components/patient/DiagnosisResultView"
import { useRouter } from "next/navigation"

export function DiagnosisResultViewWrapper({ session }: { session: any }) {
  const router = useRouter()

  return (
    <DiagnosisResultView 
      result={session.diagnosis} 
      sessionId={session.id} 
      existingMessages={session.messages}
      onRestart={() => router.push("/diagnose")} 
    />
  )
}
