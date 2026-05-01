"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { HttpChatTransport } from "ai"
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
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Props {
  initialDiagnosis: any
  sessionId: string | null
  onBack: () => void
}

export function DiagnosisChat({ initialDiagnosis, sessionId, onBack }: Props) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, isLoading } = useChat({
    transport: new HttpChatTransport({ 
      api: "/api/chat",
      body: { chatSessionId: sessionId }
    }),
    initialMessages: [
      {
        id: "diagnosis-context",
        role: "system",
        parts: [{ type: "text", text: `CONTEXT: The patient has received a preliminary diagnosis for: ${initialDiagnosis.summary}. Specialty: ${initialDiagnosis.specialty}. Severity: ${initialDiagnosis.severity}. Explanation: ${initialDiagnosis.explanation}. Possible Conditions: ${initialDiagnosis.possibleConditions?.join(", ")}.` }],
      },
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: `Hello! I'm your One-Tap Clinical Companion. I see you've just received your clinical summary for ${initialDiagnosis.summary}. I'm here to discuss this with you, answer any questions you might have, or just provide some comfort. How are you feeling about the assessment?` }],
      }
    ],
  })

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
    if (m.content) return m.content
    if (m.parts) {
      return m.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("")
    }
    return ""
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col gap-6 px-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 font-bold text-muted-foreground hover:text-primary">
          <ArrowLeft size={18} />
          Back to Analysis
        </Button>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={14} className="animate-pulse" />
          Secure Consultation Active
        </div>
      </div>

      <Card className="flex-1 bg-card/50 border-border backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden flex flex-col relative">
        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth"
        >
          {messages.filter(m => m.role !== "system").map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex items-start gap-4 max-w-[85%]",
                m.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                m.role === "user" ? "bg-primary text-white" : "bg-slate-900 text-primary"
              )}>
                {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className={cn(
                "p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                m.role === "user" 
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
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-8 border-t border-border bg-card/50">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
            className="flex items-center gap-4 bg-secondary/30 p-2 rounded-[1.5rem] border border-border/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything about your diagnosis..."
              className="flex-1 bg-transparent border-0 outline-none px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
          </form>
          <p className="text-center mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-primary" />
            AI Clinical Companion • Warm & Empathetic Logic
          </p>
        </div>
      </Card>
    </div>
  )
}
