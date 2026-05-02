import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    const appointment = await prisma.appointment.update({
      where: { id: params.id, doctorId: payload.userId },
      data: {
        status: "IN_CONSULTATION", // Or a dedicated "CONFIRMED" status if we had one, but the schema has IN_CONSULTATION
        appointmentDate: new Date(appointmentDate),
        timeSlot,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Confirm appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
