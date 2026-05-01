import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { Navbar } from "@/components/Navbar"
import { redirect } from "next/navigation"
import { DiagnosisChat } from "@/components/patient/DiagnosisChat"

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const user = token ? verifyToken(token) : null

  if (!user) {
    redirect("/login")
  }

  // @ts-ignore - Prisma client property generated but IDE may be stale
  const session = await prisma.chatSession.findUnique({
    where: { id: id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })

  if (!session || session.userId !== user.userId) {
    return redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-transparent relative pb-20">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 relative z-10">
        <DiagnosisChat 
          initialDiagnosis={session.diagnosis} 
          sessionId={session.id} 
          existingMessages={session.messages}
          backUrl={`/diagnose/${id}`}
        />
      </main>
    </div>
  )
}
