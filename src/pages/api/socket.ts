import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { prisma } from "@/lib/prisma"

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server... creating")
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id)

      socket.on("join-room", (appointmentId: string) => {
        socket.join(appointmentId)
        console.log(`Socket ${socket.id} joined room: ${appointmentId}`)
      })

      socket.on("send-message", async (data: { appointmentId: string, senderId: string, content: string }) => {
        const { appointmentId, senderId, content } = data
        
        try {
          // Persist message to DB
          const message = await prisma.appointmentMessage.create({
            data: {
              appointmentId,
              senderId,
              content,
            },
            include: {
              sender: { select: { name: true, role: true } }
            }
          })

          // Broadcast to the room
          io.to(appointmentId).emit("new-message", message)
        } catch (error) {
          console.error("Socket message error:", error)
        }
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
