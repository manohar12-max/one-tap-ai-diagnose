import { prisma } from "@/lib/prisma"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"
import { NextResponse } from "next/server"
import { isValidObjectId } from "@/lib/utils"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
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
        },
        user: {
          select: {
            name: true,
            age: true,
            gender: true,
            bloodGroup: true,
            medicalHistory: true,
            chronicConditions: true,
            email: true,
            mobile: true
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Allow access if user is owner OR user is a DOCTOR
    const isOwner = session.userId === user.userId;
    const isDoctor = user.role === 'DOCTOR';

    if (!isOwner && !isDoctor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Fetch Single History Error:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const token = getTokenFromRequest(req)
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // @ts-ignore - Prisma client property generated but IDE may be stale
    const session = await prisma.chatSession.findUnique({
      where: { id: id },
      select: { userId: true }
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Only allow deletion if user is the owner
    if (session.userId !== user.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // @ts-ignore - Prisma client property generated but IDE may be stale
    await prisma.chatSession.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: "Session deleted successfully" })
  } catch (error) {
    console.error("Delete History Session Error:", error)
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 })
  }
}
