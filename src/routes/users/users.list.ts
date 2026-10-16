import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { users, selectUserSchema } from '@db/schema.js';

const schema = {
  tags: ['Users'],
  summary: 'List all users',
  response: { 200: z.array(selectUserSchema) },
};

export const listUsersRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/', { schema }, async (req, reply) => {
    const allUsers = await req.server.db.select().from(users);
    return reply.send(allUsers);
  });
};
