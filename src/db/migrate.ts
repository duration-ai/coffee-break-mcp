import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

async function main() {
  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is required');
  }

  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is required');
  }

  const client = createClient({
    url,
    authToken,
  });

  const db = drizzle(client);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations complete!');
  client.close();
}

await main();
