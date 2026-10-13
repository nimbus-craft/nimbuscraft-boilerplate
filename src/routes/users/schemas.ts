import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '../../db/schema.js';

export const userResponseSchema = createSelectSchema(users);
export const userIdParamSchema = userResponseSchema.pick({ id: true });
export const createUserSchema = createInsertSchema(users, {
  name: (s) => s.min(2, 'Name must be at least 2 characters'),
  email: (s) => s.email('Invalid email address'),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type UserResponse = z.infer<typeof userResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;

export const getUsersSchema = {
  tags: ['Users'],
  summary: 'List all users',
  response: { 200: z.array(userResponseSchema) },
};

export const getUserByIdSchema = {
  tags: ['Users'],
  summary: 'Get user by ID',
  params: userIdParamSchema,
  response: { 200: userResponseSchema },
};

export const createUserRouteSchema = {
  tags: ['Users'],
  summary: 'Create a new user',
  body: createUserSchema,
  response: { 201: userResponseSchema },
};
