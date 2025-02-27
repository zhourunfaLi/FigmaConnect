import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, type User } from "./auth";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    if (!req.user) {
      res.status(401).send("Must be logged in to add category");
      return;
    }
    const category = await storage.createCategory(req.body);
    res.json(category);
  });

  app.get("/api/artworks", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const artworks = categoryId 
      ? await storage.getArtworksByCategory(categoryId)
      : await storage.getArtworks();
    res.json(artworks);
  });

  app.post("/api/artworks", async (req, res) => {
    if (!req.user) {
      res.status(401).send("Must be logged in to add artwork");
      return;
    }

    try {
      const artwork = await storage.createArtwork({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        videoUrl: req.body.videoUrl,
        isPremium: req.body.isPremium,
      });
      res.status(200).json(artwork);
    } catch (error) {
      console.error('Error creating artwork:', error);
      res.status(500).send("Failed to create artwork");
    }
  });

  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`[Debug] Received request for artwork ID: ${id}`);

      if (isNaN(id)) {
        console.log(`[Debug] Invalid ID format: ${req.params.id}`);
        res.status(400).send("Invalid artwork ID");
        return;
      }

      const artwork = await storage.getArtwork(id);
      console.log(`[Debug] Database query result:`, artwork);

      if (!artwork) {
        console.log(`[Debug] No artwork found for ID: ${id}`);
        res.status(404).send("Artwork not found");
        return;
      }

      if (artwork.isPremium && !req.user?.isPremium) {
        console.log(`[Debug] Premium content access denied for user:`, req.user);
        res.status(403).send("Premium content requires membership");
        return;
      }

      res.json(artwork);
    } catch (error) {
      console.error('[Error] Error fetching artwork:', error);
      res.status(500).send("Internal server error");
    }
  });

  // 获取评论
  app.get("/api/artworks/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getComments(parseInt(req.params.id));
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 创建评论
  app.post("/api/artworks/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const artwork = await storage.getArtwork(artworkId);

      if (!artwork) {
        return res.status(404).json({ error: "作品不存在" });
      }

      // 检查评论是否已禁用
      if (artwork.commentsEnabled === false) {
        return res.status(403).json({ error: "此作品的评论功能已关闭" });
      }

      const user = req.user as User;
      const comment = await storage.createComment({
        artworkId,
        userId: user.id,
        username: user.username,
        content: req.body.content,
      });
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 删除评论
  app.delete("/api/comments/:id", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const user = req.user as User;
      const comment = await storage.getComment(commentId);

      if (!comment) {
        return res.status(404).json({ error: "评论不存在" });
      }

      // 只有评论作者或管理员可以删除评论
      if (comment.userId !== user.id && user.role !== "admin") {
        return res.status(403).json({ error: "没有权限删除此评论" });
      }

      await storage.deleteComment(commentId);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 举报评论
  app.post("/api/comments/:id/report", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.getComment(commentId);

      if (!comment) {
        return res.status(404).json({ error: "评论不存在" });
      }

      // 记录举报信息
      await storage.reportComment(commentId, (req.user as User).id);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 切换作品评论状态（开启/关闭）
  app.post("/api/artworks/:id/comments/toggle", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const artwork = await storage.getArtwork(artworkId);

      if (!artwork) {
        return res.status(404).json({ error: "作品不存在" });
      }

      // 切换评论状态
      const newStatus = !(artwork.commentsEnabled === true);
      await storage.updateArtworkCommentStatus(artworkId, newStatus);

      res.json({ commentsEnabled: newStatus });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 记录浏览量
  app.post("/api/artworks/:id/view", async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const views = await storage.recordView(artworkId);
      res.json({ views });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 点赞作品
  app.post("/api/artworks/:id/like", isAuthenticated, async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const userId = (req.user as User).id;

      const result = await storage.toggleLike(artworkId, userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 收藏作品
  app.post("/api/artworks/:id/bookmark", isAuthenticated, async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const userId = (req.user as User).id;

      const result = await storage.toggleBookmark(artworkId, userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 获取用户对作品的操作状态（点赞、收藏）
  app.get("/api/artworks/:id/user-actions", isAuthenticated, async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const userId = (req.user as User).id;

      const actions = await storage.getUserArtworkActions(artworkId, userId);
      res.json(actions);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // 设置作品的SVIP状态（管理员专用）
  app.post("/api/artworks/:id/premium", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const artworkId = parseInt(req.params.id);
      const isPremium = req.body.isPremium;

      await storage.updateArtworkPremiumStatus(artworkId, isPremium);
      res.json({ success: true, isPremium });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}