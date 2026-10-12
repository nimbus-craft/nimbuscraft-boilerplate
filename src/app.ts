import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import underPressure from '@fastify/under-pressure';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

import { env } from './config/env.js';
import { loggerConfig } from './config/logger.js';
import { errorHandler } from './middlewares/error-handler.js';
import { authenticate } from './middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildApp() {
  const app = fastify({
    logger: loggerConfig,
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

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Autoload Plugins
  app.register(autoload, {
    dir: join(__dirname, 'plugins'),
  });

  // Autoload Routes
  app.register(autoload, {
    dir: join(__dirname, 'routes'),
  });

  return app;
}
