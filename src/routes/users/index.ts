import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createUserRouteSchema,
  getUserByIdSchema,
  getUsersSchema,
} from './schemas.js';
import {
  createUserHandler,
  getUserByIdHandler,
  getUsersHandler,
} from './handlers.js';

const usersPlugin: FastifyPluginAsync = async (app) => {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get('/', { schema: getUsersSchema }, getUsersHandler);
  api.get('/:id', { schema: getUserByIdSchema }, getUserByIdHandler);
  api.post('/', { schema: createUserRouteSchema }, createUserHandler);
};

export default usersPlugin;
