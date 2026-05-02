import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  return handleRequest({})
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  return handleRequest(body)
}

async function handleRequest(params: any) {
  try {
    const { specialty, city } = params
    const dbWhere: any = { role: "DOCTOR" }
    
    // Only apply filters if they are provided and NOT empty strings
    if (city && typeof city === 'string' && city.trim() !== "") {
      dbWhere.city = { contains: city.trim(), mode: 'insensitive' }
    }
    if (specialty && typeof specialty === 'string' && specialty.trim() !== "") {
      dbWhere.specialty = { contains: specialty.trim(), mode: 'insensitive' }
    }

    let doctors = await prisma.user.findMany({
      where: dbWhere,
    })

    // Hardcoded Fallback for development if DB is empty
    if (!doctors || doctors.length === 0) {
      doctors = [
        {
          id: "69f609a31bb1afef5f0f5197",
          name: "Makrant Dhule",
          specialty: "General Physician",
          experience: 15,
          clinicName: "Health Tower",
          clinicAddress: "Medical Square, Mumbai",
          city: "Mumbai",
          degree: "MBBS, MD"
        },
        {
          id: "69f6159573528007a436d660",
          name: "Mandy",
          specialty: "General Physician",
          experience: 8,
          clinicName: "One Tap Clinic",
          clinicAddress: "Clinic Location",
          city: "Mumbai",
          degree: "MBBS"
        }
      ] as any[]
    }

    const mapped = doctors.map(doc => ({
      id: doc.id,
      name: doc.name || "Specialist",
      specialty: doc.specialty || "General Physician",
      rating: 4.9,
      reviews: 50,
      experience: doc.experience ? `${doc.experience} Years` : "Experienced",
      location: doc.clinicAddress || doc.clinicName || doc.city || "Clinic Location",
      distance: "Platform Partner", 
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name || 'doctor'}`,
      tags: ["Verified Partner", "Priority Booking", doc.degree || "MBBS"].filter(Boolean),
      phone: "+91 9999999999",
      isRegistered: true
    }))

    return NextResponse.json({ doctors: mapped })
  } catch (error: any) {
    console.error("Registered API Error:", error)
    return NextResponse.json({ doctors: [] })
  }
}
