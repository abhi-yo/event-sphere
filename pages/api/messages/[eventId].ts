import { Redis } from 'ioredis';
import { NextApiRequest, NextApiResponse } from 'next';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { eventId } = req.query;

    if (typeof eventId !== 'string') {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    try {
      const redisKey = `event:${eventId}:messages`;
      const messages = await redis.lrange(redisKey, 0, -1);
      const parsedMessages = messages.map(message => JSON.parse(message));

      res.status(200).json(parsedMessages.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
