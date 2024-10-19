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
};

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const SocketHandler = (req: NextApiRequest, res: SocketWithIO) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO');
    const io = new ServerIO(res.socket.server as any, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('New connection:', socket.id);

      socket.on('join', (eventId: string) => {
        socket.join(eventId);
        console.log(`User ${socket.id} joined event: ${eventId}`);
      });

      socket.on('leave', (eventId: string) => {
        socket.leave(eventId);
        console.log(`User ${socket.id} left event: ${eventId}`);
      });

      socket.on('message', async ({ eventId, message }) => {
        const redisKey = `event:${eventId}:messages`;
        await redis.lpush(redisKey, JSON.stringify(message));
        await redis.expire(redisKey, 30);
        io.to(eventId).emit('message', message);
        console.log(`Message added to event ${eventId}. Expiration set to 30 seconds.`);

        [10, 20, 30].forEach((seconds) => {
          setTimeout(async () => {
            const messageCount = await redis.llen(redisKey);
            console.log(`Event ${eventId} message count after ${seconds} seconds: ${messageCount}`);
          }, seconds * 1000);
        });
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO already initialized');
  }

  res.end();
};

export default SocketHandler;
