"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, X, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSocket } from "@/lib/socket"
import { toast } from "sonner"

interface Message {
  id: string
  appointmentId: string
  content: string
  senderId: string
  sender: {
    name: string
    role: string
  }
  createdAt: string
}

interface ChatInterfaceProps {
  appointmentId: string
  currentUserId: string
  doctorName: string
  onClose: () => void
}

export function ChatInterface({ appointmentId, currentUserId, doctorName, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socket = getSocket()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    fetchMessages()
    
    socket.emit("join-room", appointmentId)

    socket.on("new-message", (message: Message) => {
      if (message.appointmentId === appointmentId) {
        setMessages((prev) => [...prev, message])
      }
    })

    return () => {
      socket.off("new-message")
    }
  }, [appointmentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    socket.emit("send-message", {
      appointmentId,
      senderId: currentUserId,
      content: input,
    })

    setInput("")
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-2xl">
      <div className="p-6 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-black text-foreground uppercase tracking-tight">{doctorName}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Consultation</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={32} className="animate-spin text-primary/20" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center text-muted-foreground">
              <MessageSquare size={32} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                  msg.senderId === currentUserId
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-secondary/50 text-foreground rounded-bl-none border border-border"
                }`}
              >
                <div className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">
                  {msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-card/50 backdrop-blur-xl border-t border-border">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message here..."
            className="w-full h-14 bg-secondary/30 border border-border rounded-2xl pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
          <Button
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
