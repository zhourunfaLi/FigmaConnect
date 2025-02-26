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
    // 创建categories表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        display_order INTEGER
      );
    `);

    // 创建artworks表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS artworks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        videoUrl TEXT,
        categoryId INTEGER REFERENCES categories(id),
        isPremium BOOLEAN DEFAULT false NOT NULL,
        hideTitle BOOLEAN DEFAULT false NOT NULL,
        displayOrder INTEGER,
        columnPosition INTEGER,
        aspectRatio TEXT
      );
    `);

    // 创建users表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_premium BOOLEAN DEFAULT false NOT NULL
      );
    `);

    // 创建comments表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        artwork_id INTEGER REFERENCES artworks(id) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    console.log('数据库表创建成功');
  } catch (error) {
    console.error('创建数据库表失败:', error);
    throw error;
  }
}

initDB();
