import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Use a persistent file if not in production, or just use sqlite.db in workdir
let dbPath = path.resolve(process.cwd(), 'sqlite.db');
if (process.env.DATA_DIR) {
  dbPath = path.resolve(process.env.DATA_DIR, 'sqlite.db');
} else if (process.env.NODE_ENV === 'production' && require('fs').existsSync('/data')) {
  dbPath = '/data/sqlite.db';
}
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
