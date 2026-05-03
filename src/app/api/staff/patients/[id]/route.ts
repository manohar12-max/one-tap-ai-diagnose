import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: patientId } = await params;
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || payload.role !== "DOCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch patient details
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        patientAppointments: {
          where: { doctorId: payload.userId },
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: {
              select: { name: true, specialty: true }
            }
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Calculate some aggregations
    const visitCount = patient.patientAppointments.length;
    const lastVisit = patient.patientAppointments[0]?.createdAt || null;
    const recentDiagnosis = patient.patientAppointments[0]?.aiDiagnosis || null;

    return NextResponse.json({
      ...patient,
      visitCount,
      lastVisit,
      recentDiagnosis,
      appointments: patient.patientAppointments
    });
  } catch (error) {
    console.error("Patient Detail Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
