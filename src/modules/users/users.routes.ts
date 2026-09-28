import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { UsersService } from './users.service.js';

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;

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
    async () => UsersService.findAll()
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
    async (request) => UsersService.findById(request.params.id)
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
    async (request, reply) => {
      const user = await UsersService.create(request.body);
      return reply.status(201).send(user);
    }
  );
}
