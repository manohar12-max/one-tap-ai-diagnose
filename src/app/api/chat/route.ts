import { streamText, convertToModelMessages } from "ai"
import { model, CHAT_SYSTEM_PROMPT } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { messages, chatSessionId } = await req.json()
    
    // Get user from auth token
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const userPayload = token ? verifyToken(token) : null

    let userContext = "";

    // If user is logged in, fetch their clinical context
    if (userPayload?.userId) {
      const fullUser = await prisma.user.findUnique({
        where: { id: userPayload.userId },
        select: {
          age: true,
          gender: true,
          medicalHistory: true,
          allergies: true,
          chronicConditions: true,
          currentMedications: true
        } as any
      }) as any;

      if (fullUser) {
        userContext = `\n\nPATIENT MEDICAL CONTEXT:\n`;
        if (fullUser.age) userContext += `- Age: ${fullUser.age}\n`;
        if (fullUser.gender) userContext += `- Gender: ${fullUser.gender}\n`;
        if (fullUser.allergies?.length) userContext += `- Allergies: ${fullUser.allergies.join(", ")}\n`;
        if (fullUser.chronicConditions?.length) userContext += `- Chronic Conditions: ${fullUser.chronicConditions.join(", ")}\n`;
        if (fullUser.medicalHistory) userContext += `- History: ${fullUser.medicalHistory}\n`;
        if (fullUser.currentMedications) userContext += `- Current Medications: ${fullUser.currentMedications}\n`;
        
        userContext += `\nIMPORTANT: Use this history to inform your triage. For example, if they are allergic to a common drug, do not suggest it. If they have a chronic condition like Diabetes, consider its impact on their new symptoms.`;
      }
    }

    const result = await streamText({
      model: model,
      messages: await convertToModelMessages(messages),
      system: CHAT_SYSTEM_PROMPT + userContext,
      onFinish: async ({ text }) => {
        if (userPayload && chatSessionId) {
          try {
            const lastUserMessage = messages[messages.length - 1]
            const lastUserText = lastUserMessage.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") || lastUserMessage.content || ""
            
            // Save messages to database
            // @ts-ignore
            await prisma.message.create({
              data: {
                chatSessionId,
                role: "user",
                content: lastUserText,
              }
            })
            
            // @ts-ignore
            await prisma.message.create({
              data: {
                chatSessionId,
                role: "assistant",
                content: text,
              }
            })
          } catch (dbError) {
            console.error("Database save error:", dbError)
          }
        }
      }
    })

    // @ts-ignore
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat Error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
