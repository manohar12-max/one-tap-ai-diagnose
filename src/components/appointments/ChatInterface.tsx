"use client"

import { useState, useEffect, useRef } from "react"
import { Send, User, X, Loader2, MessageSquare } from "lucide-react"
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
}

export function ChatInterface({ appointmentId, currentUserId, partnerName, onClose }: any) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
            if (prev.some(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
        }
      })

      socket.emit("join-room", appointmentId)
    }

    init()
    const interval = setInterval(fetchMessages, 15000) // Longer poll since socket is active

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    if (!input.trim()) return
    const content = input.trim()
    setInput("")

    try {
      // Use Hybrid HTTP Send for 100% Reliability
      const res = await fetch(`/api/appointments/${appointmentId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUserId, content })
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error("Failed to send: " + err.error)
        setInput(content) // Restore input on fail
      }
    } catch (error) {
      toast.error("Network error while sending")
      setInput(content)
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

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin opacity-20" size={32} /></div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${String(msg.senderId) === String(currentUserId) ? "justify-end" : "justify-start"}`}>
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm transition-all",
                String(msg.senderId) === String(currentUserId) ? "bg-primary text-white rounded-br-none" : "bg-secondary text-foreground rounded-bl-none"
              )}>
                <div className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">
                  {msg.sender?.name || "User"} • {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                </div>
                {msg.content}
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
            placeholder="Type a message..."
            className="w-full h-12 bg-secondary/50 rounded-xl px-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
