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

    // 1. First attempt: Search for doctors with the required specialty
    let matchedDoctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        specialty: specialty && typeof specialty === 'string' && specialty.trim() !== ""
          ? { contains: specialty.trim(), mode: 'insensitive' }
          : undefined
      },
    })

    // 2. Fallback: If no specialty match, or just to be safe, get all doctors to ensure we show something
    let allDoctors = matchedDoctors;
    if (allDoctors.length === 0) {
      allDoctors = await prisma.user.findMany({
        where: { role: "DOCTOR" },
        take: 10 // Limit fallback to top 10
      });
    }

    // Sort: Specialty match first, then same city
    const sortedDoctors = [...allDoctors].sort((a, b) => {
      // Specialty priority
      const specA = specialty && a.specialty?.toLowerCase().includes(specialty.toLowerCase()) ? 1 : 0;
      const specB = specialty && b.specialty?.toLowerCase().includes(specialty.toLowerCase()) ? 1 : 0;
      if (specA !== specB) return specB - specA;

      // City priority
      const cityMatchA = city && a.city?.toLowerCase().includes(city.toLowerCase()) ? 1 : 0;
      const cityMatchB = city && b.city?.toLowerCase().includes(city.toLowerCase()) ? 1 : 0;
      return cityMatchB - cityMatchA;
    });

    const mapped = sortedDoctors.map(doc => {
      const isLocal = city && doc.city?.toLowerCase().includes(city.toLowerCase());
      const isSpecMatch = specialty && doc.specialty?.toLowerCase().includes(specialty.toLowerCase());

      return {
        id: doc.id,
        name: doc.name || "Specialist",
        specialty: doc.specialty || "General Physician",
        rating: 4.9,
        reviews: 50,
        experience: doc.experience ? `${doc.experience} Years` : "Experienced",
        location: doc.clinicAddress || doc.clinicName || doc.city || "Clinic Location",
        distance: isLocal ? "Nearby" : "Online Consultation",
        image: `https://api.dicebear.com/7.x/notionists/svg?seed=${doc.name || 'doctor'}`,
        tags: [
          "Verified Partner",
          isLocal ? "Clinic Visit" : "Online Consult",
          !isSpecMatch ? "General Support" : null,
          doc.degree || "MBBS"
        ].filter(Boolean),
        phone: "+91 9999999999",
        isRegistered: true,
        isLocal: isLocal,
        isSpecialtyMatch: !!isSpecMatch
      }
    })

    return NextResponse.json({ doctors: mapped })
  } catch (error: any) {
    console.error("Registered API Error:", error)
    return NextResponse.json({ doctors: [] })
  }
}
