import { z } from 'zod';

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

export const getUsersSchema = {
  summary: 'List all users',
  description: 'Retrieves all registered users',
  tags: ['Users'],
  response: {
    200: z.array(userResponseSchema),
  },
};

export const getUserByIdSchema = {
  summary: 'Get user by ID',
  description: 'Retrieves a single user by their UUID identifier',
  tags: ['Users'],
  params: userIdParamSchema,
  response: {
    200: userResponseSchema,
  },
};

export const createUserRouteSchema = {
  summary: 'Create a new user',
  description: 'Registers a new user in the system',
  tags: ['Users'],
  body: createUserSchema,
  response: {
    201: userResponseSchema,
  },
};

export type UserResponse = z.infer<typeof userResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
