import type { FastifyPluginAsync } from 'fastify';
import { listUsersRoute } from './users.list.js';
import { getUserByIdRoute } from './users.get.js';
import { createUserRoute } from './users.create.js';

const usersPlugin: FastifyPluginAsync = async (app) => {
  await app.register(listUsersRoute);
  await app.register(getUserByIdRoute);
  await app.register(createUserRoute);
};

export default usersPlugin;
