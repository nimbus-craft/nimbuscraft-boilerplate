import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { loggerConfig } from './config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildApp() {
  const app = fastify({
    logger: loggerConfig,
  });

  // Zod type provider compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Autoload Plugins
  app.register(autoload, {
    dir: join(__dirname, 'plugins'),
  });

  // Autoload Routes
  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: { prefix: '/' },
  });

  return app;
}
