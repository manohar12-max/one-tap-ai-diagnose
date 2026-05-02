import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch recent chat sessions with user details
    const sessions = await prisma.chatSession.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            age: true,
            gender: true,
            city: true
          }
        }
      },
      take: 20 // Last 20 sessions
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching triage sessions:", error)
    return NextResponse.json({ error: "Failed to fetch triage queue" }, { status: 500 })
  }
}
