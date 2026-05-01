import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const data = await req.json()
    const { role } = payload

    let updateData: any = {
      isDetailsFilled: true,
    }

    if (role === "DOCTOR") {
      if (!data.specialty || !data.licenseNumber || !data.experience) {
        return NextResponse.json({ error: "Missing required doctor fields" }, { status: 400 })
      }
      updateData.specialty = data.specialty
      updateData.licenseNumber = data.licenseNumber
      updateData.experience = parseInt(data.experience)
    } else {
      // Patient fields are optional
      if (data.age) updateData.age = parseInt(data.age)
      if (data.gender) updateData.gender = data.gender
      if (data.medicalHistory) updateData.medicalHistory = data.medicalHistory
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
    })

    return NextResponse.json({ message: "Details updated successfully", user: updatedUser })
  } catch (error) {
    console.error("Update details error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
