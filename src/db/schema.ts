import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  apiToken: text('api_token').unique().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const coffeeBreaks = sqliteTable('coffee_breaks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  durationMs: integer('duration_ms'),
  isComplete: integer('is_complete', { mode: 'boolean' })
    .default(false)
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CoffeeBreak = typeof coffeeBreaks.$inferSelect;
export type NewCoffeeBreak = typeof coffeeBreaks.$inferInsert;
