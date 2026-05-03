import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"



export async function GET() {
  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    })

    return new Response(JSON.stringify(sessions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Fetch History Error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    await prisma.chatSession.deleteMany({
      where: { userId: user.userId }
    })

    return new Response(JSON.stringify({ message: "History cleared successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Clear History Error:", error)
    return new Response(JSON.stringify({ error: "Failed to clear history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
