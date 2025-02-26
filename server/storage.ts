import { artworks, comments, users, categories, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

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
    this.initializeData();
  }

  private async initializeData() {
    // 检查categories表是否为空
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length === 0) {
      // 添加初始分类
      await db.insert(categories).values([
        { name: "油画", description: "古典与现代油画作品", displayOrder: 1 },
        { name: "水彩", description: "水彩艺术作品", displayOrder: 2 },
        { name: "素描", description: "铅笔与炭笔素描", displayOrder: 3 },
        { name: "数字艺术", description: "数字创作艺术", displayOrder: 4 }
      ]);
    }

    // 检查artworks表是否为空
    const existingArtworks = await db.select().from(artworks);
    if (existingArtworks.length === 0) {
      // 添加示例作品
      await db.insert(artworks).values([
        {
          title: "向日葵",
          description: "梵高的经典作品",
          imageUrl: "https://placehold.co/400x600",
          videoUrl: null,
          categoryId: 1,
          isPremium: false,
          hideTitle: false,
          displayOrder: 1
        },
        {
          title: "星空",
          description: "梵高的代表作",
          imageUrl: "https://placehold.co/400x800",
          videoUrl: null,
          categoryId: 1,
          isPremium: false,
          hideTitle: false,
          displayOrder: 2
        }
      ]);
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
    const existingArtworks = await db.select().from(artworks);
    if (existingArtworks.length === 0) {
      // 如果数据库为空,插入示例数据
      const sampleArtworks = [
        {
          title: "向日葵",
          description: "梵高的经典作品",
          imageUrl: "https://placehold.co/400x600",
          videoUrl: null,
          isPremium: false,
          hideTitle: false,
          categoryId: 1
        },
        {
          title: "星空",
          description: "梵高的代表作",
          imageUrl: "https://placehold.co/400x800", 
          videoUrl: null,
          isPremium: false,
          hideTitle: false,
          categoryId: 1
        }
      ];
      await db.insert(artworks).values(sampleArtworks);
      return await db.select().from(artworks);
    }
    return existingArtworks;
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
      .where(eq(artworks.categoryId, categoryId))
      .orderBy(artworks.displayOrder);
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
}

export const storage = new DatabaseStorage();