import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.get("/api/artworks", async (_req, res) => {
    const artworks = await storage.getArtworks();
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
      if (isNaN(id)) {
        res.status(400).send("Invalid artwork ID");
        return;
      }

      const artwork = await storage.getArtwork(id);
      if (!artwork) {
        res.status(404).send("Artwork not found");
        return;
      }

      if (artwork.isPremium && !req.user?.isPremium) {
        res.status(403).send("Premium content requires membership");
        return;
      }

      res.json(artwork);
    } catch (error) {
      console.error('Error fetching artwork:', error);
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

  const httpServer = createServer(app);
  return httpServer;
}