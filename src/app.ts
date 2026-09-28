import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';

import { env } from './config/env.js';
import { AppError } from './errors/app-error.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';

export function buildApp() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
  });

  // Zod type provider compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Security & Utility Plugins
  app.register(helmet, { global: true });
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.register(sensible);

  // Global Error Handler
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
        details: error.details,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Invalid request payload or parameters',
        details: error.validation,
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: 'InternalServerError',
      message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
    });
  });

  // Register Routes
  app.register(healthRoutes);
  app.register(usersRoutes);

  return app;
}
