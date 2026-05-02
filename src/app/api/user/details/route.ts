import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        mobile: true,
        name: true,
        role: true,
        isDetailsFilled: true,
        city: true,
        age: true,
        gender: true,
        bloodGroup: true,
        height: true,
        weight: true,
        medicalHistory: true,
        allergies: true,
        chronicConditions: true,
        currentMedications: true,
        emergencyContact: true,
        specialty: true,
        licenseNumber: true,
        experience: true,
        degree: true,
        clinicName: true,
        clinicAddress: true,
        consultationFee: true,
        bio: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Fetch user details error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      console.error("No token found in cookies")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      console.error("Token verification failed")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const data = await req.json()
    console.log("Received update data:", JSON.stringify(data, null, 2))
    const { role } = payload

    // Helper to safely parse integers
    const safeParseInt = (val: any) => {
      if (val === undefined || val === null || val === "") return undefined;
      const parsed = parseInt(val);
      return isNaN(parsed) ? undefined : parsed;
    }

    let updateData: any = {
      isDetailsFilled: true,
      age: safeParseInt(data.age),
      gender: data.gender || undefined,
      city: data.city || undefined,
    }

    if (role === "DOCTOR") {
      updateData = {
        ...updateData,
        specialty: data.specialty || undefined,
        licenseNumber: data.licenseNumber || undefined,
        experience: safeParseInt(data.experience),
        degree: data.degree || undefined,
        clinicName: data.clinicName || undefined,
        clinicAddress: data.clinicAddress || undefined,
        consultationFee: safeParseInt(data.consultationFee),
        bio: data.bio || undefined,
      }
    } else {
      // Patient fields
      updateData = {
        ...updateData,
        bloodGroup: data.bloodGroup || undefined,
        height: data.height || undefined,
        weight: data.weight || undefined,
        medicalHistory: data.medicalHistory || undefined,
        allergies: Array.isArray(data.allergies) ? data.allergies : undefined,
        chronicConditions: Array.isArray(data.chronicConditions) ? data.chronicConditions : undefined,
        currentMedications: data.currentMedications || undefined,
        emergencyContact: data.emergencyContact || undefined,
      }
    }

    // Clean up undefined fields to avoid Prisma issues
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log("Applying update for user:", payload.userId, "Data:", JSON.stringify(updateData, null, 2))

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
    })

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser })
  } catch (error) {
    console.error("Update details error full stack:", error)
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
