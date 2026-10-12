import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../config/env.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(
  async (app) => {
    await app.register(fastifyCookie, {
      secret: env.COOKIE_SECRET,
    });

    await app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
      cookie: {
        cookieName: 'token',
        signed: false,
      },
    });

    app.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      }
    );
  },
  {
    name: 'auth',
  }
);
