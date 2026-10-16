import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createInsertSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';
import { users, selectUserSchema } from '@db/schema.js';

const schema = {
  tags: ['Users'],
  summary: 'Create a new user',
  body: createInsertSchema(users, {
    name: (s) => s.min(2, 'Name must be at least 2 characters'),
    email: (s) => s.email('Invalid email address'),
  }).omit({ id: true, createdAt: true, updatedAt: true }),
  response: { 201: selectUserSchema },
};

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/', { schema }, async (req, reply) => {
    const { db, httpErrors } = req.server;

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, req.body.email));

    if (existing) {
      throw httpErrors.conflict(`User with email ${req.body.email} already exists`);
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name: req.body.name,
        email: req.body.email,
      })
      .returning();

    return reply.status(201).send(newUser);
  });
};
