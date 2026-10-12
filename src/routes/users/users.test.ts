import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../app.js';

describe('Users Route', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject invalid user payload', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'A',
        email: 'invalid-email',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 400 for invalid uuid in param', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/invalid-uuid',
    });

    expect(response.statusCode).toBe(400);
  });
});
