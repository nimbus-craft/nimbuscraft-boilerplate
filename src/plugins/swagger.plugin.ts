import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export default fp(
  async (app) => {
    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Nimbuscraft API',
          description: 'API Documentation generated automatically from Zod schemas',
          version: '1.0.0',
        },
      },
      transform: jsonSchemaTransform,
    });

    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    });
  },
  {
    name: 'swagger-plugin',
  }
);
