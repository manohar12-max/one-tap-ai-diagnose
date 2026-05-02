import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = getTokenFromRequest(req)
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-ignore - Prisma client property generated but IDE may be stale
    const session = await prisma.chatSession.findUnique({
      where: { id: id },
      include: { 
        messages: { 
          orderBy: { createdAt: 'asc' } 
        } 
      }
    })

    if (!session || session.userId !== user.userId) {
      return NextResponse.json({ error: "Session not found or access denied" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Fetch Single History Error:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}
