import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    // Verify user belongs to this appointment
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        OR: [
          { patientId: payload.userId },
          { doctorId: payload.userId }
        ]
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found or access denied" }, { status: 404 })
    }

    const messages = await prisma.appointmentMessage.findMany({
      where: { appointmentId: params.id },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { name: true, role: true } }
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Fetch messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
