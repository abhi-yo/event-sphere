import { Server as NetServer } from 'http';
import { Redis } from 'ioredis';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

type SocketServer = NetServer & {
  io?: ServerIO;
};

type SocketWithIO = NextApiResponse & {
  socket: {
    server: SocketServer;
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
}

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const SocketHandler = (req: NextApiRequest, res: SocketWithIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    io.on('connection', (socket) => {
      socket.on('join', (eventId: string) => {
        socket.join(eventId);
        console.log(`User joined event: ${eventId}`);
      });

      socket.on('leave', (eventId: string) => {
        socket.leave(eventId);
        console.log(`User left event: ${eventId}`);
      });

      socket.on('message', async ({ eventId, message }) => {
        const redisKey = `event:${eventId}:messages`
        await redis.lpush(redisKey, JSON.stringify(message))
        await redis.expire(redisKey, 30) // Set expiry to 30 seconds
        io.to(eventId).emit('message', message)

        console.log(`Message added to event ${eventId}. Expiration set to 30 seconds.`);

        // Log message count every 10 seconds
        setTimeout(async () => {
          const messageCount = await redis.llen(redisKey)
          console.log(`Event ${eventId} message count after 10 seconds: ${messageCount}`)
        }, 10000)

        setTimeout(async () => {
          const messageCount = await redis.llen(redisKey)
          console.log(`Event ${eventId} message count after 20 seconds: ${messageCount}`)
        }, 20000)

        setTimeout(async () => {
          const messageCount = await redis.llen(redisKey)
          console.log(`Event ${eventId} message count after 30 seconds: ${messageCount}`)
        }, 30000)
      })
    })

    res.socket.server.io = io
  }
  res.end();
}

export default SocketHandler
