
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
    console.log(`[Debug] 获取作品列表请求，分类ID: ${categoryId || '全部'}`);
    try {
      const artworks = categoryId 
        ? await storage.getArtworksByCategory(categoryId)
        : await storage.getArtworks();
      
      console.log(`[Debug] 返回作品数量: ${artworks.length}`);
      if (artworks.length === 0) {
        console.log('[Debug] 无法找到任何作品');
      }
      
      res.json(artworks);
    } catch (error) {
      console.error('[Error] 获取作品失败:', error);
      res.status(500).send("获取作品列表失败");
    }
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
        res.status(400).json({ error: "Invalid artwork ID", details: req.params.id });
        return;
      }

      // 添加重试逻辑
      let retries = 3;
      let artwork = null;
      
      while (retries > 0) {
        try {
          artwork = await storage.getArtwork(id);
          break; // 如果成功获取数据，退出循环
        } catch (err) {
          // 如果是数据库连接错误，尝试重试
          if (err.message.includes('terminating connection') || 
              err.message.includes('Connection terminated')) {
            console.log(`[Debug] Database connection error, retrying (${retries} attempts left)`);
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
              continue;
            }
          }
          // 对于其他错误或重试用尽，直接抛出
          throw err;
        }
      }
      
      console.log(`[Debug] Database query result:`, artwork);

      if (!artwork) {
        console.log(`[Debug] No artwork found for ID: ${id}`);
        res.status(404).json({ error: "Artwork not found", artworkId: id });
        return;
      }

      if (artwork.isPremium && !req.user?.isPremium) {
        console.log(`[Debug] Premium content access denied for user:`, req.user);
        res.status(403).json({ error: "Premium content requires membership" });
        return;
      }

      res.json(artwork);
    } catch (error) {
      console.error('[Error] Error fetching artwork:', error);
      res.status(500).json({ 
        error: "Internal server error", 
        message: error.message,
        status: 500
      });
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

  // 广告配置相关API
  app.get("/api/ad-configs", async (_req, res) => {
    try {
      const configs = await storage.getAdConfigs();
      
      // 解析JSON字符串为数组
      const processedConfigs = configs.map(config => ({
        ...config,
        adPositions: JSON.parse(config.adPositions as string)
      }));
      
      res.json(processedConfigs);
    } catch (error) {
      console.error("获取广告配置失败:", error);
      res.status(500).send("获取广告配置失败");
    }
  });

  app.get("/api/ad-configs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const config = await storage.getAdConfig(id);
      
      if (!config) {
        return res.status(404).send("广告配置不存在");
      }
      
      // 解析JSON字符串为数组
      const processedConfig = {
        ...config,
        adPositions: JSON.parse(config.adPositions as string)
      };
      
      res.json(processedConfig);
    } catch (error) {
      console.error("获取广告配置失败:", error);
      res.status(500).send("获取广告配置失败");
    }
  });

  app.post("/api/ad-configs", async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).send("需要管理员权限");
    }
    
    try {
      const data = {
        ...req.body,
        adPositions: JSON.stringify(req.body.adPositions || [])
      };
      
      const config = await storage.createAdConfig(data);
      
      // 解析JSON字符串为数组
      const processedConfig = {
        ...config,
        adPositions: JSON.parse(config.adPositions as string)
      };
      
      res.status(201).json(processedConfig);
    } catch (error) {
      console.error("创建广告配置失败:", error);
      res.status(500).send("创建广告配置失败");
    }
  });

  app.patch("/api/ad-configs/:id", async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).send("需要管理员权限");
    }
    
    try {
      const id = parseInt(req.params.id);
      
      // 如果请求中包含adPositions，需要将其转换为JSON字符串
      const data = { ...req.body };
      if (data.adPositions) {
        data.adPositions = JSON.stringify(data.adPositions);
      }
      
      const config = await storage.updateAdConfig(id, data);
      
      // 解析JSON字符串为数组
      const processedConfig = {
        ...config,
        adPositions: JSON.parse(config.adPositions as string)
      };
      
      res.json(processedConfig);
    } catch (error) {
      console.error("更新广告配置失败:", error);
      res.status(500).send("更新广告配置失败");
    }
  });

  app.delete("/api/ad-configs/:id", async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).send("需要管理员权限");
    }
    
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdConfig(id);
      res.status(204).end();
    } catch (error) {
      console.error("删除广告配置失败:", error);
      res.status(500).send("删除广告配置失败");
    }
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
