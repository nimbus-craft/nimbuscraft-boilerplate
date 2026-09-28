import type { FastifyInstance } from 'fastify';
import { healthRoutes } from '../modules/health/health.routes.js';
import { usersRoutes } from '../modules/users/users.routes.js';

export async function appRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(usersRoutes);
}
