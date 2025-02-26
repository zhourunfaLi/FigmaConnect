import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order"),
});

export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  category_id: integer("category_id").references(() => categories.id),
  is_premium: boolean("is_premium").default(false).notNull(),
  hide_title: boolean("hide_title").default(false).notNull(),
  display_order: integer("display_order"),  // 控制显示顺序
  column_position: integer("column_position"), // 控制在第几列显示(1-4)
  aspect_ratio: text("aspect_ratio"), // 控制显示宽高比
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  artworkId: integer("artwork_id").references(() => artworks.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArtworkSchema = createInsertSchema(artworks);
export const insertCommentSchema = createInsertSchema(comments);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Artwork = typeof artworks.$inferSelect;
export type Comment = typeof comments.$inferSelect;

export const mockArtworks: Artwork[] = [
  {
    id: 1,
    title: "向日葵",
    description: "梵高的经典作品",
    image_url: "https://placehold.co/400x600",
    video_url: null,
    is_premium: false,
    hide_title: true,
    category_id: 1
  },
  {
    id: 2,
    title: "戴珍珠耳环的少女",
    description: "维米尔的杰作",
    image_url: "https://placehold.co/400x400",
    video_url: null,
    is_premium: true,
    hide_title: true,
    category_id: 1
  },
  {
    id: 3,
    title: "蒙娜丽莎",
    description: "达芬奇最著名的作品",
    image_url: "https://placehold.co/400x300",
    video_url: null,
    is_premium: false,
    hide_title: false,
    category_id: 1
  },
  {
    id: 4,
    title: "星空",
    description: "梵高的代表作",
    image_url: "https://placehold.co/400x800",
    video_url: null,
    is_premium: true,
    hide_title: false,
    category_id: 1
  },
  {
    id: 5,
    title: "维纳斯的诞生",
    description: "波提切利的名作",
    image_url: "https://placehold.co/400x500",
    video_url: null,
    is_premium: false,
    hide_title: false,
    category_id: 1
  },
  {
    id: 6,
    title: "吻",
    description: "克林姆特的代表作",
    image_url: "https://placehold.co/400x700",
    video_url: null,
    is_premium: true,
    hide_title: false,
    category_id: 1
  }
];