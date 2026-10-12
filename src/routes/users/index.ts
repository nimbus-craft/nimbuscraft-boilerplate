import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import {
  createUserSchema,
  userIdParamSchema,
  userResponseSchema,
} from './schemas.js';
import {
  createUserHandler,
  getUserByIdHandler,
  getUsersHandler,
} from './handlers.js';

const usersPlugin: FastifyPluginAsync = async (app) => {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    '/',
    {
      schema: {
        summary: 'List all users',
        tags: ['Users'],
        response: {
          200: z.array(userResponseSchema),
        },
      },
    },
    getUsersHandler
  );

  typedApp.get(
    '/:id',
    {
      schema: {
        summary: 'Get user by ID',
        tags: ['Users'],
        params: userIdParamSchema,
        response: {
          200: userResponseSchema,
        },
      },
    },
    getUserByIdHandler
  );

  typedApp.post(
    '/',
    {
      schema: {
        summary: 'Create a new user',
        tags: ['Users'],
        body: createUserSchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    createUserHandler
  );
};

export default usersPlugin;
