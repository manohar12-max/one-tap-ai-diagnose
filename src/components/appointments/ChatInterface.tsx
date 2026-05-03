"use client"

import { useState, useEffect, useRef } from "react"
import { Send, User, X, Loader2, MessageSquare, Lock, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSocket } from "@/lib/socket"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  appointmentId: string
  content: string
  senderId: string
  sender?: { name: string; role: string }
  createdAt: string
  isOptimistic?: boolean // New property for optimistic updates
}

export function ChatInterface({ appointmentId, currentUserId, partnerName, onClose, lockedUntil, isWaitingForConfirmation }: any) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false) // New sending state
  const [connected, setConnected] = useState(false)
  const [isLocked, setIsLocked] = useState(true) // Start locked
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkLock = () => {
      if (isWaitingForConfirmation) {
        setIsLocked(true)
        return
      }

      if (!lockedUntil) {
        setIsLocked(false)
        return
      }

      const now = new Date().getTime()
      const unlockTime = new Date(lockedUntil).getTime()
      if (now >= unlockTime) {
        if (isLocked) {
          setIsLocked(false)
          toast.success("Consultation session is now LIVE!", {
            description: `You can now start chatting with ${partnerName}.`
          })
        }
      } else {
        setIsLocked(true)
      }
    }

    checkLock()
    const interval = setInterval(checkLock, 5000)
    return () => clearInterval(interval)
  }, [lockedUntil, isLocked, isWaitingForConfirmation, partnerName])

  useEffect(() => {
    fetchMessages()
    
    let active = true
    const init = async () => {
      const socket = await getSocket()
      if (!active) return
      socketRef.current = socket
      setConnected(socket.connected)

      socket.on("connect", () => setConnected(true))
      socket.on("disconnect", () => setConnected(false))
      
      socket.on("new-message", (msg: Message) => {
        console.log("[Hybrid Chat] Received via Socket:", msg)
        if (String(msg.appointmentId).trim() === String(appointmentId).trim()) {
          setMessages(prev => {
            // Remove the optimistic version if it exists
            const filtered = prev.filter(m => !(m.isOptimistic && m.content === msg.content && m.senderId === msg.senderId))
            if (filtered.some(m => m.id === msg.id)) return filtered
            return [...filtered, msg]
          })
        }
      })

      socket.emit("join-room", appointmentId)
    }

    init()
    const interval = setInterval(fetchMessages, 15000)

    return () => {
      active = false
      if (socketRef.current) {
        socketRef.current.off("new-message")
        socketRef.current.off("connect")
        socketRef.current.off("disconnect")
      }
      clearInterval(interval)
    }
  }, [appointmentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (e) {} finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isSending) return
    const content = input.trim()
    setInput("")
    setIsSending(true)

    // 1. Optimistic Update
    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      appointmentId,
      content,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      const res = await fetch(`/api/appointments/${appointmentId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUserId, content })
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error("Failed to send: " + err.error)
        // Remove optimistic message and restore input on fail
        setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
        setInput(content)
      }
    } catch (error) {
      toast.error("Network error while sending")
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
      setInput(content)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-2xl">
      <div className="p-6 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><User size={20} /></div>
          <div>
            <h3 className="font-black text-foreground uppercase tracking-tight">{partnerName}</h3>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {connected ? "Live Connection" : "Attempting Link..."}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative">
        {isLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-500/10 border border-amber-500/20 animate-in zoom-in duration-500">
              <Lock size={40} />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                {isWaitingForConfirmation ? "Awaiting Confirmation" : "Chat Locked"}
              </h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                {isWaitingForConfirmation ? (
                  "The clinical link will activate once the doctor confirms your requested slot."
                ) : (
                  <>
                    Clinical link will activate on<br/>
                    <span className="text-primary mt-1 block">{new Date(lockedUntil).toLocaleDateString()}</span>
                    <span className="text-primary block">{new Date(lockedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-border">
               <Timer size={14} className="text-primary animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                 {isWaitingForConfirmation ? "Waiting for Doctor" : "Waiting for slot time"}
               </span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin opacity-20" size={32} /></div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${String(msg.senderId) === String(currentUserId) ? "justify-end" : "justify-start"}`}>
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm transition-all relative",
                String(msg.senderId) === String(currentUserId) ? "bg-primary text-white rounded-br-none" : "bg-secondary text-foreground rounded-bl-none",
                msg.isOptimistic && "opacity-60 grayscale-[0.5]"
              )}>
                <div className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">
                  {msg.sender?.name || (msg.isOptimistic ? "You" : "User")} • {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                </div>
                {msg.content}
                {msg.isOptimistic && (
                  <div className="absolute -left-6 bottom-1">
                    <Loader2 size={12} className="animate-spin text-primary opacity-40" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-border">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isSending ? "Sending..." : "Type a message..."}
            disabled={isSending}
            className="w-full h-12 bg-secondary/50 rounded-xl px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
