import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { eq } from 'drizzle-orm';
import { users, selectUserSchema } from '@db/schema.js';

const schema = {
  tags: ['Users'],
  summary: 'Get user by ID',
  params: selectUserSchema.pick({ id: true }),
  response: { 200: selectUserSchema },
};

export const getUserByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/:id', { schema }, async (req, reply) => {
    const { db, httpErrors } = req.server;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.params.id));

    if (!user) {
      throw httpErrors.notFound(`User with ID ${req.params.id} not found`);
    }

    return reply.send(user);
  });
};
