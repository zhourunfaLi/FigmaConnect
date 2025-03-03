
import { artworks, comments, users, categories, adConfigs, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import initTestData from "./initTestData";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getArtworks(): Promise<Artwork[]>;
  getArtwork(id: number): Promise<Artwork | undefined>;

  getComments(artworkId: number): Promise<Comment[]>;
  createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  readonly sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    // 初始化数据库时调用测试数据初始化
    this.initializeDB().then(() => {
      initTestData()
        .then(() => console.log("测试数据初始化完成"))
        .catch(err => console.error("测试数据初始化失败", err));
    });
  }

  // 初始化数据库表
  async initializeDB() {
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

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getArtworks(): Promise<Artwork[]> {
    return await db.select().from(artworks);
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    console.log(`[Debug] Executing getArtwork query with ID: ${id}`);
    try {
      // 使用原生SQL查询以确保可以获取到结果
      const result = await pool.query(`
        SELECT * FROM artworks WHERE id = $1
      `, [id]);
      
      if (result.rows.length > 0) {
        console.log(`[Debug] getArtwork query result:`, result.rows[0]);
        return result.rows[0];
      }
      return undefined;
    } catch (error) {
      console.error(`[Error] Failed to get artwork with ID ${id}:`, error);
      return undefined;
    }
  }

  async createArtwork(artwork: Omit<Artwork, "id">): Promise<Artwork> {
    const [newArtwork] = await db.insert(artworks)
      .values(artwork)
      .returning();
    return newArtwork;
  }

  async getCategories() {
    return await db.select().from(categories).orderBy(categories.displayOrder);
  }

  async createCategory(category: Omit<typeof categories.$inferInsert, "id">) {
    const [newCategory] = await db.insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getArtworksByCategory(categoryId: number) {
    return await db.select()
      .from(artworks)
      .where(eq(artworks.category_id, categoryId))
      .orderBy(artworks.display_order);
  }

  async getComments(artworkId: number): Promise<Comment[]> {
    try {
      const result = await pool.query(`
        SELECT c.*, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.artwork_id = $1
        ORDER BY c.created_at DESC
      `, [artworkId]);
      
      return result.rows;
    } catch (error) {
      console.error(`[Error] Failed to get comments for artwork ${artworkId}:`, error);
      return [];
    }
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const [newComment] = await db.insert(comments)
      .values({
        ...comment,
        createdAt: new Date(),
      })
      .returning();
    return newComment;
  }

  // 广告配置相关方法
  async getAdConfigs() {
    return await db.select().from(adConfigs);
  }

  async getAdConfig(id: number) {
    const [config] = await db.select()
      .from(adConfigs)
      .where(eq(adConfigs.id, id));
    return config;
  }

  async createAdConfig(data: any) {
    const [adConfig] = await db
      .insert(adConfigs)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return adConfig;
  }

  async updateAdConfig(id: number, data: any) {
    const [updated] = await db
      .update(adConfigs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(adConfigs.id, id))
      .returning();
    return updated;
  }

  async deleteAdConfig(id: number) {
    await db.delete(adConfigs).where(eq(adConfigs.id, id));
  }
}

// 创建存储实例
export const storage = new DatabaseStorage();
