import { artworks, comments, users, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
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