import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Server as ServerIO } from "socket.io"

const globalForIo = global as unknown as { io: ServerIO }

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawAppointmentId } = await params
    const { senderId: rawSenderId, content: rawContent } = await req.json()
    
    const appointmentId = String(rawAppointmentId).trim()
    const senderId = String(rawSenderId).trim()
    const content = String(rawContent).trim()

    if (!appointmentId || !senderId || !content) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    // 1. Save to Database
    // @ts-ignore
    const message = await prisma.appointmentMessage.create({
      data: { appointmentId, senderId, content },
      include: { 
        sender: { select: { name: true, role: true } },
        appointment: { select: { doctorId: true, patientId: true } }
      }
    })

    // 2. Broadcast via Global Socket
    const io = globalForIo.io
    if (io) {
      console.log(`[Hybrid API] Broadcasting to room: ${appointmentId}`)
      io.to(appointmentId).emit("new-message", message)
      
      // Also notify the doctor and patient specifically for dashboard updates
      const { doctorId, patientId } = (message as any).appointment
      if (doctorId) io.to(`doctor-${doctorId}`).emit("new-message", message)
      if (patientId) io.to(`patient-${patientId}`).emit("new-message", message)
    } else {
      console.warn("[Hybrid API] Socket.io not initialized globally")
    }

    return NextResponse.json(message)
  } catch (error: any) {
    console.error("[Hybrid API] Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
