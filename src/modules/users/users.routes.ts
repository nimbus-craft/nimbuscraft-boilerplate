import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { UsersController } from './users.controller.js';
import { createUserSchema, userResponseSchema, userIdParamSchema } from './users.schemas.js';

export async function usersRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    '/users',
    {
      schema: {
        summary: 'List all users',
        tags: ['Users'],
        response: {
          200: z.array(userResponseSchema),
        },
      },
    },
    UsersController.getUsers
  );

  typedApp.get(
    '/users/:id',
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
    UsersController.getUserById
  );

  typedApp.post(
    '/users',
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
    UsersController.createUser
  );
}
