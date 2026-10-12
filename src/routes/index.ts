import type { FastifyPluginAsync } from 'fastify';
import { healthRoutes } from '../modules/health/health.routes.js';
import { usersRoutes } from '../modules/users/users.routes.js';

const rootRoutes: FastifyPluginAsync = async (app) => {
  await app.register(healthRoutes);
  await app.register(usersRoutes);
};

export default rootRoutes;
