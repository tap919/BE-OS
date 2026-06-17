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

export const tools = sqliteTable('tools', {
  id: text('id').primaryKey(),
  section: text('section').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  config: text('config', { mode: 'json' }),
}, (table) => {
  return {
    sectionIdx: index('tools_section_idx').on(table.section)
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
