import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildTestServer } from '../../tests/helper.js';

describe('Users Route', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return empty list initially with mock db', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
  });

  it('should create a new user with mock db', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Ada Lovelace',
        email: 'ada@nimbuscraft.dev',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.payload);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Ada Lovelace');
    expect(body.email).toBe('ada@nimbuscraft.dev');
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
