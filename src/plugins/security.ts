import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import underPressure from '@fastify/under-pressure';

export default fp(
  async (app) => {
    await app.register(helmet, {
      global: true,
      contentSecurityPolicy: false,
    });

    await app.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
    });

    await app.register(sensible);

    await app.register(underPressure, {
      maxEventLoopDelay: 1000,
      maxHeapUsedBytes: 250 * 1024 * 1024,
      maxRssBytes: 500 * 1024 * 1024,
      maxEventLoopUtilization: 0.98,
      message: 'Server under pressure, please try again later',
      retryAfter: 50,
    });
  },
  {
    name: 'security',
  }
);
