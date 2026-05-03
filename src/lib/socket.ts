
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null
let socketPromise: Promise<Socket> | null = null

export const getSocket = async () => {
  if (socket && !socket.connected) {
    console.log("[Socket] Socket disconnected, clearing singleton")
    socket = null
    socketPromise = null
  }

  // If already connected, return it
  if (socket?.connected) return socket
  
  // If connection is in progress, return the existing promise
  if (socketPromise) return socketPromise

  socketPromise = (async () => {
    try {
      console.log("[Socket] Triggering server initialization...")
      
      // Ensure server is ready by pinging the initializer API
      const initResponse = await fetch('/api/socket').catch(err => {
        console.warn("[Socket] Pre-init fetch failed (non-critical):", err.message)
        return null
      })

      if (initResponse && !initResponse.ok) {
        console.warn("[Socket] Pre-init response status:", initResponse.status)
      }

      console.log("[Socket] Connecting to /api/socketio...")
      const newSocket = io({
        path: "/api/socketio",
        addTrailingSlash: false,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        autoConnect: true,
        transports: ["polling", "websocket"], // Allow polling first for better reliability
      })

      return new Promise<Socket>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("[Socket] Connection timed out, resolving with current state")
          socket = newSocket
          resolve(newSocket)
        }, 10000)

        newSocket.on("connect", () => {
          clearTimeout(timeout)
          console.log("[Socket] Connected successfully:", newSocket.id)
          socket = newSocket
          resolve(newSocket)
        })

        newSocket.on("connect_error", (err) => {
          console.error("[Socket] Connection error details:", err.message)
          // Don't clear timeout here, let it retry or eventually timeout
        })
      })
    } catch (error) {
      console.error("[Socket] Initialization sequence failed:", error)
      socketPromise = null
      throw error
    }
  })()

  return socketPromise
}

export const disconnectSocket = () => {
  if (socket) {
    console.log("[Socket] Disconnecting...")
    socket.disconnect()
    socket = null
    socketPromise = null
  }
}
