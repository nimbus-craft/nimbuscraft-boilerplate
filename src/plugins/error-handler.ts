import fp from 'fastify-plugin';
import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { env } from '../config/env.js';

interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const details: ValidationErrorDetail[] = error.validation.map((issue) => ({
      field: issue.instancePath.replace(/^\//, ''),
      message: issue.message || 'Validation error',
      code: issue.keyword,
    }));

    return reply.status(400).send({
      error: 'ValidationError',
      message: 'Validation failed for request parameters or payload',
      details,
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
  const statusCode = error.statusCode ?? 500;
  return reply.status(statusCode).send({
    error: error.name || 'InternalServerError',
    message:
      statusCode >= 500 && env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
  });
}

export default fp(
  async (app) => {
    app.setErrorHandler(errorHandler);
  },
  {
    name: 'error-handler',
  }
);
