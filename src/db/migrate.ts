import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  console.log('⏳ Running database migrations...');

  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    await migrate(db, {
      migrationsFolder: join(__dirname, 'migrations'),
    });
    console.log('✅ Migrations applied successfully!');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

runMigrations();
