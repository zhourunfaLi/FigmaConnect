import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import passport from 'passport'; // Assuming passport is used for authentication

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

  app.get("/api/artworks/:id/comments", async (req, res) => {
    const comments = await storage.getComments(parseInt(req.params.id));
    res.json(comments);
  });

  app.post("/api/artworks/:id/comments", async (req, res) => {
    if (!req.user) {
      res.status(401).send("Must be logged in to comment");
      return;
    }

    const comment = await storage.createComment({
      content: req.body.content,
      userId: req.user.id,
      artworkId: parseInt(req.params.id),
    });

    res.status(201).json(comment);
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "退出登录失败" });
      }
      res.status(200).json({ success: true });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}