import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload || payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctorId = payload.userId
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    // 1. Fetch Stats
    const [totalPatients, pendingTriage, todayAppointments] = await Promise.all([
      prisma.appointment.count({ where: { doctorId } }),
      prisma.appointment.count({ where: { doctorId, status: "PENDING" } }),
      prisma.appointment.count({ 
        where: { 
          doctorId, 
          createdAt: { // Using createdAt as a fallback for today's volume
            gte: startOfDay,
            lte: endOfDay
          }
        } 
      })
    ])

    // 2. Fetch "Attention Needed" Bookings
    // Logic: Pending status OR High/Critical severity OR last message from patient
    const attentionNeeded = await prisma.appointment.findMany({
      where: {
        doctorId,
        OR: [
          { status: "PENDING" },
          { severity: { in: ["HIGH", "CRITICAL"] } },
          { status: "IN_CONSULTATION" } // We'll check messages below
        ]
      },
      include: {
        patient: { select: { name: true, age: true, gender: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { role: true } } }
        }
      },
      orderBy: [
        { severity: "desc" },
        { createdAt: "desc" }
      ],
      take: 10
    })

    // Refine "Attention Needed" to prioritize those where last message is from patient
    const formattedAttention = attentionNeeded.map(appt => {
      const lastMessage = appt.messages[0]
      const needsResponse = lastMessage ? lastMessage.sender.role === "PATIENT" : (appt.status === "PENDING")
      
      return {
        ...appt,
        needsResponse,
        lastMessageTime: lastMessage?.createdAt || appt.createdAt
      }
    })

    return NextResponse.json({
      stats: {
        totalPatients,
        pendingTriage,
        todayAppointments,
        avgTriageTime: "4m" // Placeholder for now
      },
      attentionNeeded: formattedAttention
    })
  } catch (error) {
    console.error("Staff overview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
