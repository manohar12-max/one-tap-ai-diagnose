import { streamObject } from "ai"
import { model, triageSchema, SYSTEM_PROMPT } from "@/lib/ai"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()

    const result = await streamObject({
      model: model,
      schema: triageSchema,
      prompt: `Patient Symptoms: ${symptoms}`,
      system: SYSTEM_PROMPT,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI Triage Error:", error)
    return new Response(JSON.stringify({ error: "Failed to process symptoms" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
