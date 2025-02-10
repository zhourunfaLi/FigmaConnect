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

  app.get("/api/artworks/:id", async (req, res) => {
    const artwork = await storage.getArtwork(parseInt(req.params.id));
    if (!artwork) {
      res.status(404).send("Artwork not found");
      return;
    }

    if (artwork.isPremium && !req.user?.isPremium) {
      res.status(403).send("Premium content requires membership");
      return;
    }

    res.json(artwork);
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
