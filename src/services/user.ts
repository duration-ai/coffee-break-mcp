import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../db/index.js';
import { users, type User } from '../db/schema.js';

export async function createUser(): Promise<User> {
  const apiToken = nanoid(32);
  const [user] = await db.insert(users).values({ apiToken }).returning();
  return user;
}

export async function getUserByToken(token: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.apiToken, token));
  return user ?? undefined;
}
