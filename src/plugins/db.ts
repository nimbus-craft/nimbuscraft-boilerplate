import fp from 'fastify-plugin';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '../config/env.js';
import * as schema from '../db/schema.js';

export type Database = NodePgDatabase<typeof schema>;

declare module 'fastify' {
  interface FastifyInstance {
    db: Database;
  }
}

export default fp(
  async (app) => {
    if (app.hasDecorator('db')) {
      return;
    }

    const pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
    });

    const drizzleDb = drizzle(pool, { schema });

    app.decorate('db', drizzleDb);

    app.addHook('onClose', async () => {
      await pool.end();
    });
  },
  {
    name: 'db',
  }
);
