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
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { status } = await req.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const updated = await prisma.appointment.update({
      where: { id: id, doctorId: payload.userId },
      data: { status },
      include: {
        patient: { select: { id: true, name: true } }
      }
    })

    // Notify patient about status change
    let message = ""
    let title = ""
    let type = "INFO"

    if (status === 'CANCELLED') {
      title = "Consultation Cancelled"
      message = `Dr. ${payload.name} has cancelled your consultation request.`
      type = "WARNING"
    } else if (status === 'COMPLETED') {
      title = "Consultation Finished"
      message = `Your consultation with Dr. ${payload.name} has been marked as completed.`
      type = "SUCCESS"
    }

    if (message) {
      // @ts-ignore - Prisma client needs regeneration
      await prisma.notification.create({
        data: {
          userId: updated.patientId,
          title,
          message,
          type,
          link: `/appointments`
        }
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update appointment status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
