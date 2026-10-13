import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  uptime: z.number(),
});

export const getHealthSchema = {
  summary: 'Health Check Endpoint',
  description: 'Returns API health status, current timestamp and system uptime',
  tags: ['Health'],
  response: {
    200: healthResponseSchema,
  },
};

export type HealthResponse = z.infer<typeof healthResponseSchema>;
