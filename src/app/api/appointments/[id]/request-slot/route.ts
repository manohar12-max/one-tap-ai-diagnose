import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { appointmentDate, timeSlot } = await req.json();

    if (!appointmentDate || !timeSlot) {
      return NextResponse.json({ error: "Date and time slot are required" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: id, patientId: payload.userId }
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const updated = await prisma.appointment.update({
      where: { id: id },
      data: {
        status: "PENDING",
        appointmentDate: new Date(appointmentDate),
        timeSlot,
      },
      include: {
        patient: { select: { name: true } }
      }
    });

    if (!appointment.doctorId) {
      return NextResponse.json({ error: "No doctor assigned to this appointment" }, { status: 400 });
    }

    await prisma.notification.create({
      data: {
        userId: appointment.doctorId,
        title: "New Slot Requested",
        message: `${payload.name} has requested a slot for their follow-up on ${new Date(appointmentDate).toLocaleDateString()}.`,
        type: "INFO",
        link: `/staff/appointments`
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Request slot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
