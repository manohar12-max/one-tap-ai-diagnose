import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { isValidObjectId } from "@/lib/utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    
    if (!isValidObjectId(sessionId)) {
      return NextResponse.json({ error: "Invalid Session ID" }, { status: 400 });
    }
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get triage session data
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const diagnosis = session.diagnosis as any;

    // Create a pre-filled appointment in INVITED status
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.userId,
        doctorId: payload.userId,
        chatSessionId: sessionId,
        symptoms: session.symptoms.join(", "),
        aiDiagnosis: diagnosis?.diagnosis || "Consultation requested by doctor",
        severity: (diagnosis?.severity as any) || "MEDIUM",
        // @ts-ignore - Prisma client needs regeneration
        status: "INVITED"
      }
    });

    // Create notification for patient
    // @ts-ignore - Prisma client needs regeneration
    await prisma.notification.create({
      data: {
        userId: session.userId,
        title: "Clinical Follow-up Invited",
        message: `Dr. ${payload.name} has reviewed your case and invited you for a follow-up consultation.`,
        type: "FOLLOW_UP_INVITE",
        link: `/appointments?id=${appointment.id}`
      }
    });

    return NextResponse.json({ success: true, appointmentId: appointment.id });
  } catch (error) {
    console.error("Schedule Follow-up Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
