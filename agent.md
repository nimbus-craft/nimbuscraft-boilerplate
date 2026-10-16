# NimbusCraft — Architecture Directives for AI Agents

## Role and Objective
Lead Engineer at NimbusCraft. Generate clean, modular, and production-ready backend code following our **Pragmatic Fastify** philosophy.

---

## Directory Structure

```text
src/
├── config/              # env.ts, logger.ts, swagger.ts
├── db/                  # schema.ts, migrate.ts, seed.ts, migrations/
├── plugins/             # Autoloaded global plugins (security, db, auth, error-handler)
├── routes/              # Autoloaded resource routes (e.g. users/)
│   └── <resource>/
│       ├── <resource>.<action>.ts  # Self-contained slice: Schema + Route + Handler
│       ├── index.ts                # Resource aggregator
│       └── <resource>.test.ts      # Colocated tests
├── tests/               # helper.ts (buildTestServer, dbMock)
├── app.ts               # buildApp() factory
└── server.ts            # Entry point & graceful shutdown
```

---

## Route Convention: `<resource>.<action>.ts`

Each endpoint lives in a single, self-contained file combining:
1. **Zod / OpenAPI Schema**
2. **Route definition and Handler** with automatic type inference via `FastifyPluginAsyncZod`

### Example 1: Individual Endpoint Slice (`users.get.ts`)

```typescript
// src/routes/users/users.get.ts
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { eq } from 'drizzle-orm';
import { users, selectUserSchema } from '@db/schema.js';

const schema = {
  tags: ['Users'],
  summary: 'Get user by ID',
  params: selectUserSchema.pick({ id: true }),
  response: { 200: selectUserSchema },
};

export const getUserByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get('/:id', { schema }, async (req, reply) => {
    const { db, httpErrors } = req.server;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.params.id));

    if (!user) throw httpErrors.notFound(`User ${req.params.id} not found`);

    return reply.send(user);
  });
};
```

### Example 2: Resource Aggregator (`index.ts`)

```typescript
// src/routes/users/index.ts
import type { FastifyPluginAsync } from 'fastify';
import { listUsersRoute } from './users.list.js';
import { getUserByIdRoute } from './users.get.js';
import { createUserRoute } from './users.create.js';

const usersPlugin: FastifyPluginAsync = async (app) => {
  await app.register(listUsersRoute);
  await app.register(getUserByIdRoute);
  await app.register(createUserRoute);
};

export default usersPlugin;
```

---

## Critical Guardrails

1. **File Naming Convention:** 1 file per use case named `<resource>.<action>.ts` (e.g., `users.list.ts`, `users.create.ts`).
2. **Zero Intermediate Layers:** Do not create `controllers/`, `services/`, `modules/`, or `middlewares/` directories.
3. **Error Handling:** Do not create custom `AppError` classes. Always throw native `@fastify/sensible` HTTP errors (`httpErrors.*`).
4. **Automatic Inference:** Always use `FastifyPluginAsyncZod` in route slices to avoid manual `FastifyRequest` type annotations.
5. **Path Aliases:** Always use `@config/*`, `@db/*`, `@plugins/*`, `@routes/*`, `@tests/*`, `@/*`.
