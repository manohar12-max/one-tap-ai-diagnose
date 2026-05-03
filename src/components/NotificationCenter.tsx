"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, ExternalLink, Loader2, X, AlertCircle, Info, CheckCircle2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function NotificationCenter({ user }: { user?: any }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
    const interval = setInterval(() => {
      if (user) fetchNotifications()
    }, 30000)
    return () => clearInterval(interval)
  }, [user?.id]) 

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers: any = {}
      if (token && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`
      }
      
      const res = await fetch("/api/notifications", { headers })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.isRead).length)
      } else if (res.status === 401) {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Failed to fetch notifications")
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const headers: any = { "Content-Type": "application/json" }
      if (token && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, isRead: true })
      })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      toast.error("Failed to update notification")
    }
  }

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      const token = localStorage.getItem("token")
      const headers: any = {}
      if (token && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
        headers
      })
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        const deletedNotif = notifications.find(n => n.id === id)
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        toast.success("Notification deleted")
      }
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  const clearAll = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers: any = {}
      if (token && token !== "null") {
        headers["Authorization"] = `Bearer ${token}`
      }

      const res = await fetch("/api/notifications?all=true", {
        method: "DELETE",
        headers
      })
      if (res.ok) {
        setNotifications([])
        setUnreadCount(0)
        toast.success("All notifications cleared")
      }
    } catch (error) {
      toast.error("Failed to clear notifications")
    }
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
      setIsOpen(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'FOLLOW_UP_INVITE': return <AlertCircle className="text-primary" size={16} />
      case 'SUCCESS': return <CheckCircle2 className="text-emerald-500" size={16} />
      case 'WARNING': return <AlertCircle className="text-amber-500" size={16} />
      default: return <Info className="text-blue-500" size={16} />
    }
  }

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => {
          const nextState = !isOpen
          setIsOpen(nextState)
          if (nextState) fetchNotifications()
        }}
        className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-secondary/80 relative"
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 md:w-96 z-50 overflow-hidden"
            >
              <Card className="bg-card border-border shadow-2xl rounded-[1.5rem] overflow-hidden flex flex-col max-h-[500px]">
                <div className="p-4 bg-secondary/30 border-b border-border flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                    <Bell size={12} className="text-primary" />
                    Clinical Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-[8px] font-black uppercase rounded-full">
                      {unreadCount} New
                    </Badge>
                  )}
                  {notifications.length > 0 && (
                    <Button 
                      variant="ghost" 
                      onClick={clearAll}
                      className="text-[8px] h-6 font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors ml-auto"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-4 opacity-40">
                      <Bell size={32} />
                      <p className="text-[9px] font-black uppercase tracking-widest">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {notifications.map((n) => (
                        <div 
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-4 hover:bg-secondary/20 transition-all cursor-pointer group relative ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                        >
                          {!n.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          )}
                          <div className="flex gap-4">
                            <div className="mt-1 shrink-0">
                              {getIcon(n.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-xs font-black uppercase tracking-tight ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {n.title}
                                </p>
                                <span className="text-[8px] font-bold text-muted-foreground whitespace-nowrap">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                {n.message}
                              </p>
                              {n.link && (
                                <div className="pt-1 flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Action <ExternalLink size={10} />
                                </div>
                              )}
                            </div>
                            <div className="shrink-0 transition-all">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => deleteNotification(e, n.id)}
                                className="w-6 h-6 rounded-md text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-secondary/10 border-t border-border text-center">
                   <Button variant="ghost" className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                     View All Activity
                   </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
