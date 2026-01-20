import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { db } from '../db/index.js';
import { coffeeBreaks, type CoffeeBreak } from '../db/schema.js';

export const MIN_BREAK_SECONDS = 1;
export const MAX_BREAK_SECONDS = 900;
const DEFAULT_BREAK_SECONDS = 300;

function clampBreakSeconds(seconds: number): number {
  return Math.min(MAX_BREAK_SECONDS, Math.max(MIN_BREAK_SECONDS, seconds));
}

export function resolveBreakSeconds(requestedSeconds?: number): number {
  if (typeof requestedSeconds === 'number' && Number.isInteger(requestedSeconds)) {
    return clampBreakSeconds(requestedSeconds);
  }

  const rawDefault = process.env.COFFEE_BREAK_DEFAULT_SECONDS;
  const parsedDefault = rawDefault ? Number.parseInt(rawDefault, 10) : NaN;
  if (!Number.isNaN(parsedDefault)) {
    return clampBreakSeconds(parsedDefault);
  }

  return DEFAULT_BREAK_SECONDS;
}

export async function startCoffeeBreak(userId?: string): Promise<CoffeeBreak> {
  const [coffeeBreak] = await db
    .insert(coffeeBreaks)
    .values({
      userId: userId ?? undefined,
      startedAt: new Date(),
    })
    .returning();
  return coffeeBreak;
}

export async function completeCoffeeBreak(
  breakId: string,
  durationMs: number,
): Promise<CoffeeBreak> {
  const now = new Date();
  const [coffeeBreak] = await db
    .update(coffeeBreaks)
    .set({
      completedAt: now,
      isComplete: true,
      durationMs,
    })
    .where(eq(coffeeBreaks.id, breakId))
    .returning();
  return coffeeBreak;
}

export async function takeCoffeeBreak(
  userId?: string,
  requestedSeconds?: number,
): Promise<string> {
  const breakSeconds = resolveBreakSeconds(requestedSeconds);
  const durationMs = breakSeconds * 1000;
  const coffeeBreak = await startCoffeeBreak(userId);

  // Sleep for the requested duration
  await new Promise((resolve) => setTimeout(resolve, durationMs));

  await completeCoffeeBreak(coffeeBreak.id, durationMs);

  return `Coffee break complete. ${breakSeconds} seconds elapsed. Returning to work.`;
}

export interface UserStats {
  totalBreaks: number;
  breaksThisWeek: number;
  averageDurationMs: number | null;
  lastTenBreaks: CoffeeBreak[];
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [totalResult] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(coffeeBreaks)
    .where(
      and(eq(coffeeBreaks.userId, userId), eq(coffeeBreaks.isComplete, true)),
    );

  const [weeklyResult] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(coffeeBreaks)
    .where(
      and(
        eq(coffeeBreaks.userId, userId),
        eq(coffeeBreaks.isComplete, true),
        gte(coffeeBreaks.startedAt, oneWeekAgo),
      ),
    );

  const [avgResult] = await db
    .select({ avg: sql<number>`cast(avg(duration_ms) as integer)` })
    .from(coffeeBreaks)
    .where(
      and(eq(coffeeBreaks.userId, userId), eq(coffeeBreaks.isComplete, true)),
    );

  const lastTenBreaks = await db
    .select()
    .from(coffeeBreaks)
    .where(eq(coffeeBreaks.userId, userId))
    .orderBy(desc(coffeeBreaks.startedAt))
    .limit(10);

  return {
    totalBreaks: totalResult.count,
    breaksThisWeek: weeklyResult.count,
    averageDurationMs: avgResult.avg,
    lastTenBreaks,
  };
}
