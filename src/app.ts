import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import underPressure from '@fastify/under-pressure';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { authenticate } from './middlewares/auth.js';
import { appRoutes } from './routes/index.js';

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
  app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
  });
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.register(sensible);
  app.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 250 * 1024 * 1024,
    maxRssBytes: 500 * 1024 * 1024,
    maxEventLoopUtilization: 0.98,
    message: 'Server under pressure, please try again later',
    retryAfter: 50,
  });

  // Authentication & Cookies
  app.register(fastifyCookie, {
    secret: env.COOKIE_SECRET,
  });
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  app.decorate('authenticate', authenticate);

  // Swagger OpenAPI Documentation
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Nimbuscraft API',
        description: 'API Documentation generated automatically from Zod schemas',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Register All Centralized Routes
  app.register(appRoutes);

  return app;
}
