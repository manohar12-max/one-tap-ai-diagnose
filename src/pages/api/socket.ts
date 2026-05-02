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
  if (res.socket.server.io) {
    console.log("[Socket] Server already attached, ensuring global sync")
    globalForIo.io = res.socket.server.io
    res.end()
    return
  }

  console.log("[Socket] Initializing Global Socket.io Server...")
  const httpServer: NetServer = res.socket.server as any
  const io = new ServerIO(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ["polling", "websocket"]
  })

  io.on("connection", (socket) => {
    console.log("[Socket] Connection:", socket.id)
    
    socket.on("join-room", (roomId: string) => {
      const cleanRoomId = String(roomId).trim()
      socket.join(cleanRoomId)
      console.log(`[Socket] ${socket.id} joined ${cleanRoomId}`)
    })

    socket.on("disconnect", () => console.log("[Socket] Disconnect:", socket.id))
  })

  res.socket.server.io = io
  globalForIo.io = io // Expose globally for App Router access
  res.end()
}

export default SocketHandler
