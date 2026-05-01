import { streamObject } from "ai"
import { model, diagnosisSchema, DIAGNOSIS_SYSTEM_PROMPT } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"



export async function POST(req: Request) {
  try {
    const { bodyPart, symptoms, description, intensity, duration, images } = await req.json()
    
    // Get user from auth token
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const user = token ? verifyToken(token) : null

    // Prepare multimodal content for Gemini
    // Create the initial session record
    let sessionId: string | undefined
    if (user) {
      // @ts-ignore - Prisma client property generated but IDE may be stale
      const session = await prisma.chatSession.create({
        data: {
          userId: user.userId,
          title: "Analyzing symptoms...",
          symptoms: symptoms,
          description: description,
          images: images || [],
        }
      })
      sessionId = session.id
    }

    const result = await streamObject({
      model: model,
      schema: diagnosisSchema,
      messages: [
        {
          role: "system",
          content: DIAGNOSIS_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Body Part Affected: ${bodyPart}\nSymptoms: ${symptoms.join(", ")}\nDescription: ${description}\nIntensity: ${intensity}/10\nDuration: ${duration}` },
            ...(images || []).map((img: string) => ({
              type: "image",
              image: img.split(",")[1] || img, // Remove data:image/png;base64, prefix if present
            })),
          ],
        },
      ],
      onFinish: async ({ object }) => {
        if (sessionId && object) {
          // Update the session with the diagnosis result
          const finalDiagnosis = {
            ...object,
            sessionId: sessionId // Ensure it's in the saved object too
          }
          
          // @ts-ignore - Prisma client property generated but IDE may be stale
          await prisma.chatSession.update({
            where: { id: sessionId },
            data: {
              title: object.summary || "Medical Diagnosis",
              diagnosis: finalDiagnosis as any,
              messages: {
                create: [
                  {
                    role: "assistant",
                    content: `Summary: ${object.summary}\nSeverity: ${object.severity}\nSpecialty: ${object.specialty}\nExplanation: ${object.explanation}`
                  }
                ]
              }
            }
          })
        }
      }
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI Diagnosis Error:", error)
    return new Response(JSON.stringify({ error: "Failed to process medical data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
