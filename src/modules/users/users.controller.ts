import type { FastifyRequest, FastifyReply } from 'fastify';
import { UsersService } from './users.service.js';
import type { CreateUserInput } from './users.schemas.js';

export class UsersController {
  static async getUsers(_request: FastifyRequest, reply: FastifyReply) {
    const users = await UsersService.findAll();
    return reply.status(200).send(users);
  }

  static async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const user = await UsersService.findById(id);
    return reply.status(200).send(user);
  }

  static async createUser(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const user = await UsersService.create(request.body);
    return reply.status(201).send(user);
  }
}
