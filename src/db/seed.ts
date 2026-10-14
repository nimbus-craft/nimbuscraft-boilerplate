import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../config/env.js';
import * as schema from './schema.js';
import { users } from './schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 1,
  });

  const db = drizzle(pool, { schema });

  try {
    const initialUsers = [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Charlie Brown', email: 'charlie@example.com' },
    ];

    for (const user of initialUsers) {
      await db
        .insert(users)
        .values(user)
        .onConflictDoNothing({ target: users.email });
    }

    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
