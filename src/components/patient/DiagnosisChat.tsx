"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  RefreshCcw,
  Smile,
  ShieldCheck,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Props {
  initialDiagnosis: any
  sessionId: string | null
  existingMessages?: any[]
  onBack?: () => void
  backUrl?: string
}

export function DiagnosisChat({ initialDiagnosis, sessionId, existingMessages = [], onBack, backUrl }: Props) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Memoize initial messages to prevent state reset on re-render during streaming
  const initialMessages = useMemo(() => {
    const mapped = existingMessages.map(m => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system",
      parts: [{ type: "text" as const, text: m.content }],
    }))

    return [
      {
        id: "diagnosis-context",
        role: "system" as const,
        parts: [{ type: "text" as const, text: `CONTEXT: The patient has received a preliminary diagnosis for: ${initialDiagnosis.summary}. Specialty: ${initialDiagnosis.specialty}. Severity: ${initialDiagnosis.severity}. Explanation: ${initialDiagnosis.explanation}. Possible Conditions: ${initialDiagnosis.possibleConditions?.join(", ")}.` }],
      },
      ...mapped.length > 0 ? mapped : [
        {
          id: "welcome",
          role: "assistant" as const,
          parts: [{ type: "text" as const, text: `Hello! I'm your One-Tap Clinical Companion. I see you've just received your clinical summary for ${initialDiagnosis.summary}. I'm here to discuss this with you, answer any questions you might have, or just provide some comfort. How are you feeling about the assessment?` }],
        }
      ]
    ]
  }, [existingMessages, initialDiagnosis])

  const { messages, sendMessage, status } = useChat({
    id: sessionId || "chat",
    transport: new DefaultChatTransport({ 
      api: "/api/chat",
      body: { chatSessionId: sessionId },
    }),
    messages: initialMessages,
  })

  useEffect(() => {
    console.log("Messages updated:", messages.length, "Status:", status)
    if (messages.length > 0) {
      const last = messages[messages.length - 1] as any
      console.log("Last message:", last.role, last.parts?.[0]?.text?.substring(0, 20) || last.content?.substring(0, 20))
    }
  }, [messages, status])
  
  const isLoading = status === "streaming" || status === "submitted"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const text = input
    setInput("")
    await sendMessage({ 
      text,
      // @ts-ignore - session ID passed in body for new SDK transport handling if needed
      // but simpler to just pass it in headers or as part of the message if custom
      // For now we'll stick to the sendMessage API
    })
  }

  const getMessageText = (m: any) => {
    // If content is a string, use it
    if (typeof m.content === 'string' && m.content.length > 0) return m.content
    
    // If parts exist, iterate through them
    if (m.parts && Array.isArray(m.parts)) {
      return m.parts
        .map((p: any) => {
          if (typeof p === 'string') return p
          if (p.text) return p.text
          if (p.type === "text") return p.text || ""
          return ""
        })
        .join("")
    }

    // Last resort fallbacks
    return m.text || ""
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="max-w-4xl mx-auto h-[92vh] flex flex-col gap-6 px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        {backUrl ? (
          <Button variant="ghost" asChild className="gap-2 font-bold text-muted-foreground hover:text-primary">
            <Link href={backUrl}>
              <ArrowLeft size={18} />
              Back to Analysis
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" onClick={onBack} className="gap-2 font-bold text-muted-foreground hover:text-primary">
            <ArrowLeft size={18} />
            Back to Analysis
          </Button>
        )}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={14} className="animate-pulse" />
          Secure Consultation Active
        </div>
      </div>

      <Card className="flex-1 bg-card/50 border-border backdrop-blur-xl shadow-2xl rounded-[1.5rem] overflow-hidden flex flex-col relative">
        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
        >
          {messages.filter(m => m.role !== "system").map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex items-start gap-4 max-w-[85%]",
                (m.role as string) === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                (m.role as string) === "user" ? "bg-primary text-white" : "bg-slate-900 text-primary"
              )}>
                {(m.role as string) === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                (m.role as string) === "user" 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-secondary/50 text-foreground border border-border rounded-tl-none"
              )}>
                {getMessageText(m)}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-primary shadow-lg animate-pulse">
                <Bot size={20} />
              </div>
              <div className="bg-secondary/30 p-5 rounded-3xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          {messages.length > 2 && !isLoading && initialDiagnosis.specialty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10 mt-8"
            >
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                <Sparkles size={14} />
                Recommended Next Step
              </div>
              <h3 className="text-lg font-black text-foreground text-center">
                Consult a {initialDiagnosis.specialty}
              </h3>
              <p className="text-xs font-medium text-muted-foreground text-center max-w-xs">
                We've found several highly-rated specialists near you who can help with these symptoms.
              </p>
              <Button 
                onClick={() => {
                  router.push(`/diagnose/${sessionId}?view=doctors`)
                }}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black gap-2 px-8"
              >
                <MapPin size={16} />
                Find Nearby Doctors
              </Button>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-border bg-card/50">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
            className="flex items-center gap-3 bg-secondary/30 p-1.5 rounded-[1.2rem] border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-0 outline-none px-3 py-2 text-sm font-bold text-foreground placeholder:text-muted-foreground"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </form>
          <p className="text-center mt-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles size={10} className="text-primary" />
            AI Clinical Companion
          </p>
        </div>
      </Card>
    </div>
  )
}
