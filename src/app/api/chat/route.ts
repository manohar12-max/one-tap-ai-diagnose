import { streamText, convertToModelMessages } from "ai"
import { model, CHAT_SYSTEM_PROMPT } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"



export async function POST(req: Request) {
  try {
    const { messages, chatSessionId } = await req.json()
    console.log(`Received chat request for session: ${chatSessionId} (${messages.length} messages)`)
    
    // Get user from auth token
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const user = token ? verifyToken(token) : null

    const result = await streamText({
      model: model,
      messages: await convertToModelMessages(messages),
      system: CHAT_SYSTEM_PROMPT,
      onFinish: async ({ text }) => {
        console.log("Stream finished. ChatSessionId:", chatSessionId, "User:", user?.userId)
        if (user && chatSessionId) {
          try {
            const lastUserMessage = messages[messages.length - 1]
            console.log("Last user message:", lastUserMessage)
            const lastUserText = lastUserMessage.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") || lastUserMessage.content || ""
            
            console.log("Saving user message:", lastUserText)
            // Save messages to database
            // @ts-ignore - Prisma client property generated but IDE may be stale
            await prisma.message.create({
              data: {
                chatSessionId,
                role: "user",
                content: lastUserText,
              }
            })
            
            console.log("Saving assistant message:", text)
            // @ts-ignore - Prisma client property generated but IDE may be stale
            await prisma.message.create({
              data: {
                chatSessionId,
                role: "assistant",
                content: text,
              }
            })
            console.log("Messages saved successfully")
          } catch (dbError) {
            console.error("Database save error:", dbError)
          }
        } else {
          console.log("Skipping save: user or chatSessionId missing")
        }
      }
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Chat Error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
