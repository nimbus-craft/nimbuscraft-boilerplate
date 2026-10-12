import type { FastifyReply, FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema.js';
import { NotFoundError, ConflictError } from '../../errors/app-error.js';
import type { CreateUserInput, UserIdParam } from './schemas.js';

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const allUsers = await request.server.db.select().from(users);
  return reply.send(allUsers);
}

export async function getUserByIdHandler(
  request: FastifyRequest<{ Params: UserIdParam }>,
  reply: FastifyReply
) {
  const [user] = await request.server.db
    .select()
    .from(users)
    .where(eq(users.id, request.params.id));

  if (!user) {
    throw new NotFoundError(`User with ID ${request.params.id} not found`);
  }

  return reply.send(user);
}

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const [existing] = await request.server.db
    .select()
    .from(users)
    .where(eq(users.email, request.body.email));

  if (existing) {
    throw new ConflictError(`User with email ${request.body.email} already exists`);
  }

  const [newUser] = await request.server.db
    .insert(users)
    .values({
      name: request.body.name,
      email: request.body.email,
    })
    .returning();

  return reply.status(201).send(newUser);
}
