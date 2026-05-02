import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized: Only doctors can confirm appointments" }, { status: 403 })
    }

    const { appointmentDate, timeSlot } = await req.json()

    if (!appointmentDate || !timeSlot) {
      return NextResponse.json({ error: "Date and time slot are required for confirmation" }, { status: 400 })
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: id, doctorId: payload.userId }
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const updated = await prisma.appointment.update({
      where: { id: id },
      data: {
        status: "IN_CONSULTATION",
        // @ts-ignore - Prisma client needs regeneration to see this field
        appointmentDate: new Date(appointmentDate),
        timeSlot,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Confirm appointment error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
