import { db } from './index.js';
import { users } from './schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  const initialUsers = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
  ];

  for (const user of initialUsers) {
    await db.insert(users).values(user).onConflictDoNothing({ target: users.email });
  }

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
