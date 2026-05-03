import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      console.log("[Patient Vault API] No token found in request");
      return NextResponse.json({ error: "Unauthorized: No token" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log("[Patient Vault API] Token verification failed");
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    if (payload.role !== "DOCTOR") {
      console.log("[Patient Vault API] Role mismatch:", payload.role);
      return NextResponse.json({ error: `Unauthorized: Required DOCTOR role, got ${payload.role}` }, { status: 401 });
    }

    console.log("[Patient Vault API] Authorized for user:", payload.userId);

    // Find all unique patients from the doctor's appointments
    // Order by createdAt desc so the latest visit for each patient is processed first
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: payload.userId },
      include: {
        patient: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by patient and aggregate some data
    const patientMap = new Map();
    appointments.forEach(app => {
      const p = app.patient;
      if (!patientMap.has(p.id)) {
        patientMap.set(p.id, {
          id: p.id,
          name: p.name,
          email: p.email,
          mobile: p.mobile,
          age: p.age,
          gender: p.gender,
          bloodGroup: p.bloodGroup,
          medicalHistory: p.medicalHistory,
          chronicConditions: p.chronicConditions,
          joinedAt: p.createdAt,
          lastVisit: app.createdAt,
          visitCount: 1,
          recentDiagnosis: app.aiDiagnosis,
          recentStatus: app.status
        });
      } else {
        const existing = patientMap.get(p.id);
        existing.visitCount += 1;
      }
    });

    return NextResponse.json(Array.from(patientMap.values()));
  } catch (error) {
    console.error("Patient Vault Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
