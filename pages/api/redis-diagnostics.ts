import { Redis } from 'ioredis';
import { NextApiRequest, NextApiResponse } from 'next';

const REDIS_URL = process.env.REDIS_URL || '';

interface Diagnostics {
  pingLatency: number;
  usedMemory: number | string;
  writeLatency: number;
  readLatency: number;
  multipleOpsLatency: number;
  connectedClients: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  const diagnostics: Partial<Diagnostics> = {};

  try {
    // Test basic connection
    const pingStart = Date.now();
    await redis.ping();
    diagnostics.pingLatency = Date.now() - pingStart;

    // Check memory usage
    const info = await redis.info('memory');
    const usedMemoryMatch = info.match(/used_memory:(\d+)/);
    diagnostics.usedMemory = usedMemoryMatch ? parseInt(usedMemoryMatch[1], 10) : 'Unable to determine';

    // Test write speed
    const writeStart = Date.now();
    await redis.set('diagnosticTest', 'value');
    diagnostics.writeLatency = Date.now() - writeStart;

    // Test read speed
    const readStart = Date.now();
    await redis.get('diagnosticTest');
    diagnostics.readLatency = Date.now() - readStart;

    // Test multiple operations
    const multiStart = Date.now();
    const pipeline = redis.pipeline();
    for (let i = 0; i < 100; i++) {
      pipeline.set(`diagnosticTest:${i}`, `value:${i}`);
    }
    await pipeline.exec();
    diagnostics.multipleOpsLatency = Date.now() - multiStart;

    // Get client list
    const clientListResult = await redis.client('LIST');
    if (typeof clientListResult === 'string') {
      diagnostics.connectedClients = clientListResult.split('\n').length - 1;
    } else {
      diagnostics.connectedClients = -1;
      console.error('Unexpected result type from redis.client("LIST")');
    }

    res.status(200).json({ success: true, diagnostics });
  } catch (error) {
    console.error('Redis diagnostic error:', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
  } finally {
    await redis.quit();
  }
}
