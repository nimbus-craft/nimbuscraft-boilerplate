import { FastifyServerOptions } from 'fastify';
import { env } from './env.js';

export const loggerConfig: FastifyServerOptions['logger'] = {
  level: env.LOG_LEVEL,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token'],
    censor: '[REDACTED]',
  },
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss.l',
            ignore: 'pid,hostname',
            colorize: true,
            singleLine: false,
            errorLikeObjectKeys: ['err', 'error'],
            errorProps: '*',
            messageFormat: '{req.method} {req.url} -> {res.statusCode} ({responseTime}ms) - {msg}',
          },
        }
      : undefined,
};


