
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
      console.log("[Socket] Initializing connection...")
      
      // Ensure server is ready
      await fetch('/api/socket').catch(() => {})

      const newSocket = io({
        path: "/api/socket",
        addTrailingSlash: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        transports: ["polling", "websocket"],
      })

      return new Promise<Socket>((resolve) => {
        newSocket.on("connect", () => {
          console.log("[Socket] Connected:", newSocket.id)
          socket = newSocket
          resolve(newSocket)
        })

        newSocket.on("connect_error", (err) => {
          console.error("[Socket] Connection error:", err.message)
          // Fallback resolve after 5s to prevent UI hang
          setTimeout(() => {
            socket = newSocket
            resolve(newSocket)
          }, 5000)
        })
      })
    } catch (error) {
      console.error("[Socket] Init failed:", error)
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
