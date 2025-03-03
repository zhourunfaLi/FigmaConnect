
import { db } from './db';
import { artworks, categories, comments, users, adConfigs } from '@shared/schema';
import { eq, sql, desc, asc, or, and, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export type Category = typeof categories.$inferSelect;
export type Artwork = typeof artworks.$inferSelect;
export type User = typeof users.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type AdConfig = typeof adConfigs.$inferSelect;

export const storage = {
  async getCategories() {
    return db.select().from(categories).orderBy(categories.displayOrder);
  },

  async createCategory(data: Omit<Category, 'id'>) {
    const result = await db
      .insert(categories)
      .values(data)
      .returning();
    return result[0];
  },

  async getArtworks() {
    // 添加排序，使结果更加可预测
    return db.select().from(artworks).orderBy(desc(artworks.id));
  },

  async getArtworksByCategory(categoryId: number) {
    return db
      .select()
      .from(artworks)
      .where(eq(artworks.categoryId, categoryId))
      .orderBy(desc(artworks.id));
  },

  async getArtwork(id: number) {
    console.log(`[Debug] getArtwork query result:`, await db.select().from(artworks).where(eq(artworks.id, id)).limit(1).then(res => res[0]));
    return db.select().from(artworks).where(eq(artworks.id, id)).limit(1).then(res => res[0]);
  },

  async createArtwork(data: Omit<Artwork, 'id'>) {
    const result = await db.insert(artworks).values(data).returning();
    return result[0];
  },

  async updateArtwork(id: number, data: Partial<Omit<Artwork, 'id'>>) {
    const result = await db
      .update(artworks)
      .set(data)
      .where(eq(artworks.id, id))
      .returning();
    return result[0];
  },

  async deleteArtwork(id: number) {
    await db.delete(artworks).where(eq(artworks.id, id));
  },

  async importFrontendArtworks(frontendArtworks: any[]) {
    // 批量导入前端作品数据到数据库
    const artworksToInsert = frontendArtworks.map((artwork, index) => ({
      id: artwork.id || index + 50, // 从50开始避免与现有ID冲突
      title: artwork.title,
      description: artwork.description || '作品描述',
      imageUrl: artwork.imageUrl || 'https://placehold.co/400x400',
      videoUrl: artwork.videoUrl || null,
      categoryId: artwork.themeId === 'city' ? 2 : 1, // 根据themeId判断分类
      isPremium: artwork.isPremium || false,
      hideTitle: false,
      displayOrder: index,
      columnPosition: Math.floor(Math.random() * 3), // 随机列位置
      aspectRatio: artwork.aspectRatio ? artwork.aspectRatio.toString() : '1.0'
    }));

    // 批量插入，忽略冲突
    for (const artwork of artworksToInsert) {
      try {
        await db.insert(artworks).values(artwork).onConflictDoNothing();
      } catch (err) {
        console.error(`导入作品失败: ${artwork.title}`, err);
      }
    }

    return db.select().from(artworks).orderBy(desc(artworks.id));
  },

  async getComments(artworkId: number) {
    return db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        userId: comments.userId,
        username: users.username,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.artworkId, artworkId))
      .orderBy(desc(comments.createdAt));
  },

  async createComment(data: {
    content: string;
    userId: number;
    artworkId: number;
  }) {
    const result = await db
      .insert(comments)
      .values({
        content: data.content,
        userId: data.userId,
        artworkId: data.artworkId,
      })
      .returning();
    
    return {
      ...result[0],
      username: (await db.select().from(users).where(eq(users.id, data.userId)).limit(1))[0]?.username,
    };
  },

  async getAdConfigs() {
    return db.select().from(adConfigs);
  },
  
  async getAdConfig(id: number) {
    return db.select().from(adConfigs).where(eq(adConfigs.id, id)).limit(1).then(res => res[0]);
  },
  
  async createAdConfig(data: Omit<AdConfig, 'id'>) {
    const result = await db.insert(adConfigs).values(data).returning();
    return result[0];
  },
  
  async updateAdConfig(id: number, data: Partial<Omit<AdConfig, 'id'>>) {
    const result = await db.update(adConfigs).set(data).where(eq(adConfigs.id, id)).returning();
    return result[0];
  },
  
  async deleteAdConfig(id: number) {
    await db.delete(adConfigs).where(eq(adConfigs.id, id));
  }
};


import { artworks, comments, users, categories, adConfigs, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
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
      { name: "油画", description: "油画作品", displayOrder: 1 },
      { name: "水彩", description: "水彩作品", displayOrder: 2 },
      { name: "素描", description: "素描作品", displayOrder: 3 }
    ]).onConflictDoNothing();

    // 添加艺术品
    await db.insert(artworks).values([
      {
        title: "向日葵",
        description: "梵高的经典作品",
        imageUrl: "https://placehold.co/400x600",
        isPremium: false,
        hideTitle: false,
        categoryId: 1
      },
      {
        title: "星空",
        description: "梵高的代表作",
        imageUrl: "https://placehold.co/400x600",
        isPremium: true,
        hideTitle: false,
        categoryId: 1
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
    return await db.select()
      .from(comments)
      .where(eq(comments.artworkId, artworkId))
      .orderBy(comments.createdAt);
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

export const storage = new DatabaseStorage();
