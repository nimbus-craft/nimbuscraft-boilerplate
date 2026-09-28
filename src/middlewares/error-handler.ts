import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../errors/app-error.js';
import { env } from '../config/env.js';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
      details: error.details,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      error: 'ValidationError',
      message: 'Invalid request payload or parameters',
      details: error.validation,
    });
  }

  request.log.error(error);
  return reply.status(500).send({
    error: 'InternalServerError',
    message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
  });
}
