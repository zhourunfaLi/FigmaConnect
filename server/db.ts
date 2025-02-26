
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// 初始化数据库表
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        display_order INTEGER
      );

      CREATE TABLE IF NOT EXISTS artworks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        video_url TEXT,
        category_id INTEGER REFERENCES categories(id),
        is_premium BOOLEAN DEFAULT false NOT NULL,
        hide_title BOOLEAN DEFAULT false NOT NULL,
        display_order INTEGER,
        column_position INTEGER,
        aspect_ratio TEXT
      );
    `);
    console.log('数据库表创建成功');
  } catch (error) {
    console.error('创建数据库表失败:', error);
    throw error;
  }
}

initDB();

export { db };
