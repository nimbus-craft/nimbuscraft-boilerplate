import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { swaggerOptions, swaggerUiOptions } from '../config/swagger.js';

export default fp(
  async (app) => {
    await app.register(fastifySwagger, swaggerOptions);
    await app.register(fastifySwaggerUi, swaggerUiOptions);
  },
  {
    name: 'swagger',
  }
);
