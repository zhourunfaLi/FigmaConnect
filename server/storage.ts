import { artworks, comments, users, categories, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
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
      aspect_ratio TEXT,
      commentsEnabled BOOLEAN DEFAULT true
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
    const artworkData = Array.from({ length: 20 }, (_, i) => ({
      title: `艺术作品 ${i + 1}`,
      description: `艺术作品描述 ${i + 1}`,
      image_url: `https://placehold.co/400x600/png`,
      video_url: null,
      category_id: 1,
      is_premium: [2, 5, 8, 11, 14, 17].includes(i), // 固定一些作品为SVIP
      hide_title: false,
      display_order: null,
      column_position: null,
      aspect_ratio: null,
      likes: Math.floor(Math.random() * 1000) // 随机点赞数
    }));

    await db.insert(artworks).values(artworkData).onConflictDoNothing();


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
  createArtwork(artwork: Omit<Artwork, "id">): Promise<Artwork>;
  getCategories(): Promise<any>;
  createCategory(category: Omit<typeof categories.$inferInsert, "id">): Promise<any>;
  getArtworksByCategory(categoryId: number): Promise<any>;

  getComments(artworkId: number): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
  reportComment(commentId: number, userId: number): Promise<void>;
  updateArtworkCommentStatus(artworkId: number, enabled: boolean): Promise<void>;

  recordView(artworkId: number): Promise<number>;
  getArtworkViewCount(artworkId: number): Promise<number>;
  toggleLike(artworkId: number, userId: number): Promise<{ liked: boolean; likesCount: number }>;
  getArtworkLikesCount(artworkId: number): Promise<number>;
  toggleBookmark(artworkId: number, userId: number): Promise<{ bookmarked: boolean }>;
  getUserArtworkActions(artworkId: number, userId: number): Promise<{ liked: boolean; bookmarked: boolean }>;
  updateArtworkPremiumStatus(artworkId: number, isPremium: boolean): Promise<void>;

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
    const results = await db.select().from(artworks).orderBy(sql`id DESC`);
    return results.map(artwork => ({
      ...artwork,
      isPremium: artwork.is_premium, // 保持与数据库中的is_premium一致
      likes: Math.floor(Math.random() * 2000) // 临时添加随机点赞数用于演示
    }));
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    console.log(`[Debug] Getting artwork with id: ${id}`);
    const [artwork] = await db.select({
      ...artworks,
      category_name: categories.name,
    })
      .from(artworks)
      .leftJoin(categories, eq(artworks.category_id, categories.id))
      .where(eq(artworks.id, id));

    if (!artwork) return undefined;

    // 获取点赞数
    const likesCount = await this.getArtworkLikesCount(id);

    // 获取浏览量
    const views = await this.getArtworkViewCount(id);

    return {
      ...artwork,
      isPremium: artwork.is_premium,
      likes: likesCount,
      views: views
    };
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
    const results = await db.select().from(comments)
      .where(eq(comments.artworkId, artworkId))
      .orderBy(desc(comments.createdAt));
    return results;
  }

  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment;
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const [result] = await db.insert(comments).values(comment).returning();
    return result;
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async reportComment(commentId: number, userId: number): Promise<void> {
    // 创建评论举报表（如果不存在）
    if (!pool.query) return; // 确保连接已初始化

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comment_reports (
        id SERIAL PRIMARY KEY,
        comment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(comment_id, user_id)
      )
    `);

    // 记录举报
    await pool.query(
      'INSERT INTO comment_reports (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [commentId, userId]
    );
  }

  async updateArtworkCommentStatus(artworkId: number, enabled: boolean): Promise<void> {
    await db.update(artworks)
      .set({ commentsEnabled: enabled })
      .where(eq(artworks.id, artworkId));
  }

  async recordView(artworkId: number): Promise<number> {
    // 创建艺术品查看记录表
    if (!pool.query) return 0;

    await pool.query(`
      CREATE TABLE IF NOT EXISTS artwork_views (
        id SERIAL PRIMARY KEY,
        artwork_id INTEGER NOT NULL,
        viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT
      )
    `);

    // 记录查看
    await pool.query(
      'INSERT INTO artwork_views (artwork_id) VALUES ($1)',
      [artworkId]
    );

    // 返回总浏览量
    return this.getArtworkViewCount(artworkId);
  }

  async getArtworkViewCount(artworkId: number): Promise<number> {
    if (!pool.query) return 0;

    try {
      const result = await pool.query(
        'SELECT COUNT(*) FROM artwork_views WHERE artwork_id = $1',
        [artworkId]
      );

      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      console.error("Error getting view count:", error);
      return 0;
    }
  }

  async toggleLike(artworkId: number, userId: number): Promise<{ liked: boolean; likesCount: number }> {
    // 创建艺术品点赞表
    if (!pool.query) return { liked: false, likesCount: 0 };

    await pool.query(`
      CREATE TABLE IF NOT EXISTS artwork_likes (
        id SERIAL PRIMARY KEY,
        artwork_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(artwork_id, user_id)
      )
    `);

    // 检查用户是否已点赞
    const existingLike = await pool.query(
      'SELECT id FROM artwork_likes WHERE artwork_id = $1 AND user_id = $2',
      [artworkId, userId]
    );

    const hasLiked = existingLike.rows.length > 0;

    if (hasLiked) {
      // 取消点赞
      await pool.query(
        'DELETE FROM artwork_likes WHERE artwork_id = $1 AND user_id = $2',
        [artworkId, userId]
      );
    } else {
      // 添加点赞
      await pool.query(
        'INSERT INTO artwork_likes (artwork_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [artworkId, userId]
      );
    }

    // 获取最新点赞数
    const likesCount = await this.getArtworkLikesCount(artworkId);

    return {
      liked: !hasLiked,
      likesCount
    };
  }

  async getArtworkLikesCount(artworkId: number): Promise<number> {
    if (!pool.query) return 0;

    try {
      const result = await pool.query(
        'SELECT COUNT(*) FROM artwork_likes WHERE artwork_id = $1',
        [artworkId]
      );

      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      console.error("Error getting likes count:", error);
      return 0;
    }
  }

  async toggleBookmark(artworkId: number, userId: number): Promise<{ bookmarked: boolean }> {
    // 创建艺术品收藏表
    if (!pool.query) return { bookmarked: false };

    await pool.query(`
      CREATE TABLE IF NOT EXISTS artwork_bookmarks (
        id SERIAL PRIMARY KEY,
        artwork_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(artwork_id, user_id)
      )
    `);

    // 检查用户是否已收藏
    const existingBookmark = await pool.query(
      'SELECT id FROM artwork_bookmarks WHERE artwork_id = $1 AND user_id = $2',
      [artworkId, userId]
    );

    const hasBookmarked = existingBookmark.rows.length > 0;

    if (hasBookmarked) {
      // 取消收藏
      await pool.query(
        'DELETE FROM artwork_bookmarks WHERE artwork_id = $1 AND user_id = $2',
        [artworkId, userId]
      );
    } else {
      // 添加收藏
      await pool.query(
        'INSERT INTO artwork_bookmarks (artwork_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [artworkId, userId]
      );
    }

    return {
      bookmarked: !hasBookmarked
    };
  }

  async getUserArtworkActions(artworkId: number, userId: number): Promise<{ liked: boolean; bookmarked: boolean }> {
    if (!pool.query) return { liked: false, bookmarked: false };

    // 检查点赞状态
    const likeResult = await pool.query(
      'SELECT id FROM artwork_likes WHERE artwork_id = $1 AND user_id = $2',
      [artworkId, userId]
    );

    // 检查收藏状态
    const bookmarkResult = await pool.query(
      'SELECT id FROM artwork_bookmarks WHERE artwork_id = $1 AND user_id = $2',
      [artworkId, userId]
    );

    return {
      liked: likeResult.rows.length > 0,
      bookmarked: bookmarkResult.rows.length > 0
    };
  }

  async updateArtworkPremiumStatus(artworkId: number, isPremium: boolean): Promise<void> {
    await db.update(artworks)
      .set({ is_premium: isPremium })
      .where(eq(artworks.id, artworkId));
  }
}

export const storage = new DatabaseStorage();