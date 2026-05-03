import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { Navbar } from "@/components/Navbar"
import { DiagnosisResultViewWrapper } from "./DiagnosisResultViewWrapper"
import { redirect } from "next/navigation"
import { isValidObjectId } from "@/lib/utils"

export default async function DiagnosisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const user = token ? verifyToken(token) : null

  if (!user) {
    redirect("/login")
  }

  // Handle malformed IDs gracefully
  if (!isValidObjectId(id)) {
    return (
      <div className="min-h-screen bg-transparent relative pb-20">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 text-center">
          <h2 className="text-2xl font-black text-foreground">Invalid Session ID</h2>
          <p className="text-muted-foreground mt-2">The provided session identifier is malformed.</p>
        </main>
      </div>
    )
  }

  // @ts-ignore - Prisma client property generated but IDE may be stale
  const session = await prisma.chatSession.findUnique({
    where: { id: id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })

  if (!session || session.userId !== user.userId) {
    return (
      <div className="min-h-screen bg-transparent relative pb-20">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 text-center">
          <h2 className="text-2xl font-black text-foreground">Diagnosis Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested session could not be found or you do not have permission to view it.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative pb-20">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 relative z-10">
        <DiagnosisResultViewWrapper session={session} />
      </main>
    </div>
  )
}
