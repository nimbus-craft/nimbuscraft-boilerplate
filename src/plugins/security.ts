import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import underPressure from '@fastify/under-pressure';
import { sql } from 'drizzle-orm';

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
      exposeStatusRoute: {
        url: '/health',
        routeOpts: {
          serializerCompiler: () => (data: unknown) => JSON.stringify(data),
        },
      },
      healthCheck: async (fastify) => {
        try {
          if (fastify.db) {
            await fastify.db.execute(sql`SELECT 1`);
          }
        } catch (error) {
          fastify.log.warn(
            { error },
            '⚠️ [HealthCheck] Base de datos no disponible o inaccesible (modo tolerante activado).'
          );
        }
        return true;
      },
    });
  },
  {
    name: 'security',
  }
);
