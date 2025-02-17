
import { type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import session from "express-session";
import { Store } from "express-session";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getArtworks(): Promise<Artwork[]>;
  getArtwork(id: number): Promise<Artwork | undefined>;
  getComments(artworkId: number): Promise<Comment[]>;
  createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;
}

class MemorySessionStore extends Store {
  private sessions: Map<string, any> = new Map();

  get(sid: string, callback: (err: any, session?: any) => void): void {
    const data = this.sessions.get(sid);
    callback(null, data);
  }

  set(sid: string, session: any, callback?: (err?: any) => void): void {
    this.sessions.set(sid, session);
    if (callback) callback();
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.sessions.delete(sid);
    if (callback) callback();
  }
}

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private artworks: Artwork[] = [];
  private comments: Comment[] = [];
  private nextUserId = 1;
  private nextArtworkId = 1;
  private nextCommentId = 1;

  constructor() {}

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      isPremium: false,
    };
    this.users.push(user);
    return user;
  }

  async getArtworks(): Promise<Artwork[]> {
    return this.artworks;
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    return this.artworks.find(a => a.id === id);
  }

  async createArtwork(artwork: Omit<Artwork, "id">): Promise<Artwork> {
    const newArtwork: Artwork = {
      id: this.nextArtworkId++,
      ...artwork,
    };
    this.artworks.push(newArtwork);
    return newArtwork;
  }

  async getComments(artworkId: number): Promise<Comment[]> {
    return this.comments.filter(c => c.artworkId === artworkId);
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const newComment: Comment = {
      id: this.nextCommentId++,
      ...comment,
      createdAt: new Date(),
    };
    this.comments.push(newComment);
    return newComment;
  }
}

export const storage = new MemoryStorage();
