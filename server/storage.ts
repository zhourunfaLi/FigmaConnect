import { artworks, comments, users, type User, type InsertUser, type Artwork, type Comment } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artworks: Map<number, Artwork>;
  private comments: Map<number, Comment>;
  private currentId: { users: number; artworks: number; comments: number };
  readonly sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.artworks = new Map();
    this.comments = new Map();
    this.currentId = { users: 1, artworks: 1, comments: 1 };
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    
    // Seed some initial artworks
    this.seedArtworks();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, isPremium: false };
    this.users.set(id, user);
    return user;
  }

  async getArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values());
  }

  async getArtwork(id: number): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }

  async getComments(artworkId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.artworkId === artworkId,
    );
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const id = this.currentId.comments++;
    const newComment: Comment = {
      ...comment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, newComment);
    return newComment;
  }

  private seedArtworks() {
    const sampleArtworks: Omit<Artwork, "id">[] = [
      {
        title: "The Starry Night",
        description: "Vincent van Gogh's masterpiece depicting a night scene.",
        imageUrl: "https://source.unsplash.com/random/800x600?art,painting",
        videoUrl: "https://example.com/starry-night-video",
        isPremium: false,
      },
      {
        title: "Mona Lisa",
        description: "Leonardo da Vinci's famous portrait.",
        imageUrl: "https://source.unsplash.com/random/800x600?portrait,art",
        videoUrl: "https://example.com/mona-lisa-video",
        isPremium: true,
      },
    ];

    sampleArtworks.forEach((artwork) => {
      const id = this.currentId.artworks++;
      this.artworks.set(id, { ...artwork, id });
    });
  }
}

export const storage = new MemStorage();
