import type { FastifyInstance } from 'fastify';
import { buildApp } from '../app.js';
import type { Database } from '../plugins/db.js';

const mockUsers = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Ada Lovelace',
    email: 'ada@nimbuscraft.dev',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const dbMock = {
  select: () => ({
    from: () => {
      const promise = Promise.resolve(mockUsers);
      return Object.assign(promise, {
        where: () => Promise.resolve([]),
      });
    },
  }),
  insert: () => ({
    values: (data: { name: string; email: string }) => ({
      returning: () =>
        Promise.resolve([
          {
            id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
            name: data.name,
            email: data.email,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
    }),
  }),
  execute: async () => [],
} as unknown as Database;

export async function buildTestServer(): Promise<FastifyInstance> {
  const app = buildApp();

  // Inyectar el mock de la base de datos usando app.decorate('db', dbMock)
  app.decorate('db', dbMock);

  await app.ready();
  return app;
}
