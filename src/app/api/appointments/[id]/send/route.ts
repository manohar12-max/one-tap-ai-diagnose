import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Server as ServerIO } from "socket.io"

const globalForIo = global as unknown as { io: ServerIO }

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await params
    const { senderId, content } = await req.json()

    if (!appointmentId || !senderId || !content) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    // 1. Save to Database
    // @ts-ignore
    const message = await prisma.appointmentMessage.create({
      data: { 
        appointmentId: String(appointmentId).trim(), 
        senderId: String(senderId).trim(), 
        content: String(content).trim() 
      },
      include: { sender: { select: { name: true, role: true } } }
    })

    // 2. Broadcast via Global Socket
    const io = globalForIo.io
    if (io) {
      const roomId = String(appointmentId).trim()
      console.log(`[Hybrid API] Broadcasting to room: ${roomId}`)
      io.to(roomId).emit("new-message", message)
    } else {
      console.warn("[Hybrid API] Socket.io not initialized globally")
    }

    return NextResponse.json(message)
  } catch (error: any) {
    console.error("[Hybrid API] Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
