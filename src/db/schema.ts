import { sqliteTable, text, integer, index, unique } from 'drizzle-orm/sqlite-core';

export const resources = sqliteTable('resources', {
  id: text('id').primaryKey(),
  section: text('section').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
}, (table) => {
  return {
    sectionIdx: index('resources_section_idx').on(table.section)
  };
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role', { enum: ['user', 'admin', 'editor'] }).default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const saved_resources = sqliteTable('saved_resources', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  resourceId: text('resource_id').notNull().references(() => resources.id, { onDelete: 'cascade' }),
  savedAt: integer('saved_at', { mode: 'timestamp' }),
}, (table) => {
  return {
    userIdx: index('saved_resources_user_id_idx').on(table.userId),
    resourceIdx: index('saved_resources_resource_id_idx').on(table.resourceId),
    unq: unique().on(table.userId, table.resourceId),
  };
});

export const blockchain_credentials = sqliteTable('blockchain_credentials', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  issuer: text('issuer').notNull(),
  date: text('date').notNull(),
  hash: text('hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const blockchain_circles = sqliteTable('blockchain_circles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  poolSize: text('pool_size').notNull(),
  status: text('status').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const blockchain_grants = sqliteTable('blockchain_grants', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  amount: text('amount').notNull(),
  status: text('status').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const user_stats = sqliteTable('user_stats', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  section: text('section').notNull(), // 'fair_housing', 'community', 'business', 'legal', etc.
  interactions: integer('interactions').default(0).notNull(),
  lastActive: integer('last_active', { mode: 'timestamp' }),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.section),
  };
});

export const module_progress = sqliteTable('module_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  module: text('module').notNull(),      // e.g. "financial", "business", "legal"
  actionId: text('action_id').notNull(), // e.g. "budget", "debt", "pitch", "grant"
  status: text('status').notNull(),      // "started" | "completed"
  stepReached: integer('step_reached').default(0),
  savedData: text('saved_data', { mode: 'json' }).$type<Record<string, any>>(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
}, (table) => {
  return {
    unq: unique().on(table.userId, table.module, table.actionId),
  };
});
