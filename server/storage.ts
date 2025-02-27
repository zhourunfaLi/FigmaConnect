import { artworks, comments, users, categories, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { sql } from "drizzle-orm";

// 初始化数据库表
async function initializeTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      display_order INTEGER
    );

    DROP TABLE IF EXISTS artworks CASCADE;
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
}

const PostgresSessionStore = connectPg(session);

// 初始化数据
async function initializeData() {
  try {
    // 添加分类
    await db.insert(categories).values([
      { name: "油画", description: "油画作品", display_order: 1 },
      { name: "水彩", description: "水彩作品", display_order: 2 },
      { name: "素描", description: "素描作品", display_order: 3 }
    ]).onConflictDoNothing();

    // 添加艺术品
    await db.insert(artworks).values([
      {
        title: "向日葵",
        description: "梵高的经典作品",
        image_url: "https://placehold.co/400x600",
        is_premium: false,
        hide_title: false,
        category_id: 1
      },
      {
        title: "星空",
        description: "梵高的代表作",
        image_url: "https://placehold.co/400x600",
        is_premium: true,
        hide_title: false,
        category_id: 1
      }
    ]).onConflictDoNothing();

    console.log('数据初始化成功');
  } catch (error) {
    console.error('数据初始化失败:', error);
  }
}

// 在应用启动时初始化数据
initializeData();

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
    initializeTables(); // Initialize tables on startup
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
    const [artwork] = await db.select().from(artworks).where(eq(artworks.id, id));
    console.log(`[Debug] getArtwork query result:`, artwork);
    return artwork;
  }

  async createArtwork(artwork: Omit<Artwork, "id">): Promise<Artwork> {
    const [newArtwork] = await db.insert(artworks)
      .values(artwork)
      .returning();
    return newArtwork;
  }

  async getCategories() {
    return await db.select().from(categories).orderBy(categories.display_order);
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
    return await db.select()
      .from(comments)
      .where(eq(comments.artwork_id, artworkId))
      .orderBy(comments.created_at);
  }

  async createComment(comment: Omit<Comment, "id" | "created_at">): Promise<Comment> {
    const [newComment] = await db.insert(comments)
      .values({
        ...comment,
        created_at: new Date(),
      })
      .returning();
    return newComment;
  }
}

export const storage = new DatabaseStorage();