
import { artworks, comments, users, categories, adConfigs, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { sql } from "drizzle-orm";

import { initDB } from "./db";

// 初始化数据库表 - 使用db.ts中的initDB函数
async function initializeTables() {
  try {
    await initDB();
    console.log('数据库表创建成功');
  } catch (error) {
    console.error('数据库表创建失败:', error);
  }
}

const PostgresSessionStore = connectPg(session);

// 初始化数据
async function initializeData() {
  try {
    // 添加分类
    const categoryResult = await db.insert(categories).values([
      { name: "油画", description: "油画作品", displayOrder: 1 },
      { name: "水彩", description: "水彩作品", displayOrder: 2 },
      { name: "素描", description: "素描作品", displayOrder: 3 }
    ]).onConflictDoNothing().returning();
    
    console.log('分类数据初始化结果:', categoryResult);

    // 检查artworks表是否已有数据
    const existingArtworks = await db.select({ count: sql`count(*)` }).from(artworks);
    const artworksCount = parseInt(existingArtworks[0].count.toString());
    
    if (artworksCount === 0) {
      // 添加艺术品
      const artworkResult = await db.insert(artworks).values([
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
        },
        {
          title: "蒙娜丽莎",
          description: "达芬奇的杰作",
          imageUrl: "https://placehold.co/400x600",
          isPremium: false,
          hideTitle: false,
          categoryId: 1
        }
      ]).returning();
      
      console.log('艺术品数据初始化结果:', artworkResult);
    } else {
      console.log(`艺术品表已有${artworksCount}条数据，跳过初始化`);
    }

    console.log('数据初始化成功');
  } catch (error) {
    console.error('数据初始化失败:', error);
    console.error('详细错误信息:', error.stack);
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
