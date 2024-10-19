import type { Server as HTTPServer } from 'http'
import { Redis } from 'ioredis'
import type { Socket as NetSocket } from 'net'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as IOServer } from 'socket.io'
import { Server } from 'socket.io'

interface ServerToIOServer extends HTTPServer {
  io?: IOServer
}

interface SocketNextApiResponse extends NextApiResponse {
  socket: NetSocket & {
    server: ServerToIOServer
  }
}

interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const SocketHandler = (req: NextApiRequest, res: SocketNextApiResponse): void => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO')
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    })

    io.on('connection', (socket) => {
      console.log('New connection:', socket.id)

      socket.on('join', (eventId: string) => {
        socket.join(eventId)
        console.log(`User ${socket.id} joined event: ${eventId}`)
      })

      socket.on('leave', (eventId: string) => {
        socket.leave(eventId)
        console.log(`User ${socket.id} left event: ${eventId}`)
      })

      socket.on('message', async ({ eventId, message }: { eventId: string; message: Message }) => {
        const redisKey = `event:${eventId}:messages`
        await redis.lpush(redisKey, JSON.stringify(message))
        await redis.expire(redisKey, 30)
        io.to(eventId).emit('message', message)
        console.log(`Message added to event ${eventId}. Expiration set to 30 seconds.`)

        ;[10, 20, 30].forEach((seconds) => {
          setTimeout(async () => {
            const messageCount = await redis.llen(redisKey)
            console.log(`Event ${eventId} message count after ${seconds} seconds: ${messageCount}`)
          }, seconds * 1000)
        })
      })
    })

    res.socket.server.io = io
  } else {
    console.log('Socket.IO already initialized')
  }

  res.end()
}

export default SocketHandler
