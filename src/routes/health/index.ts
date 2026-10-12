import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { healthResponseSchema } from './schemas.js';

const healthPlugin: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        summary: 'Health Check Endpoint',
        tags: ['Health'],
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }
  );
};

export default healthPlugin;
