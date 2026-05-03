import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

const globalForIo = global as unknown as { io: ServerIO }

const SocketHandler = (req: NextApiRequest, res: any) => {
  // Use global sync to prevent multiple server instances during HMR
  if (res.socket.server.io || globalForIo.io) {
    console.log("[Socket] Server already active, ensuring sync")
    if (!res.socket.server.io && globalForIo.io) {
      res.socket.server.io = globalForIo.io
    }
    res.status(200).json({ success: true, message: "Socket server already attached" })
    return
  }

  console.log("[Socket] Initializing Global Socket.io Server...")
  const httpServer: NetServer = res.socket.server as any
  const io = new ServerIO(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["polling", "websocket"]
  })

  io.on("connection", (socket) => {
    console.log("[Socket] Connection established:", socket.id)
    
    socket.on("join-room", (roomId: string) => {
      const cleanRoomId = String(roomId).trim()
      socket.join(cleanRoomId)
      console.log(`[Socket] ${socket.id} joined room: ${cleanRoomId}`)
    })

    socket.on("disconnect", () => {
      console.log("[Socket] Client disconnected:", socket.id)
    })
  })

  res.socket.server.io = io
  globalForIo.io = io // Expose globally for App Router access
  res.status(200).json({ success: true, message: "Socket server initialized" })
}

export default SocketHandler
