import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"
import { Server as ServerIO } from "socket.io"

const globalForIo = global as unknown as { io: ServerIO }

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const { doctorId, symptoms, aiDiagnosis, severity } = await req.json()

    if (!doctorId || !symptoms) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: payload.userId,
        doctorId,
        symptoms,
        aiDiagnosis: aiDiagnosis || "No AI diagnosis provided",
        severity: severity || "LOW",
        status: "PENDING",
      },
    })

    // Broadcast to the doctor
    const io = globalForIo.io
    if (io && doctorId) {
      console.log(`[Socket] Broadcasting new-appointment to doctor: doctor-${doctorId}`)
      io.to(`doctor-${doctorId}`).emit("new-appointment", appointment)
    }

    // Create notification for doctor
    // @ts-ignore - Prisma client needs regeneration
    await prisma.notification.create({
      data: {
        userId: doctorId,
        title: "New Consultation Request",
        message: `${payload.name} has requested a consultation regarding "${symptoms.slice(0, 30)}..."`,
        type: "INFO",
        link: `/staff/appointments/${appointment.id}`
      }
    });

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

    const appointments = await prisma.appointment.findMany({
      where: payload.role === "DOCTOR" 
        ? { doctorId: payload.userId } 
        : { patientId: payload.userId },
      include: {
        patient: { 
          select: { 
            name: true, 
            email: true, 
            mobile: true,
            age: true,
            gender: true,
            bloodGroup: true,
            medicalHistory: true,
            chronicConditions: true,
            currentMedications: true
          } 
        },
        doctor: { select: { name: true, specialty: true, clinicName: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Fetch appointments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
