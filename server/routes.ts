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

  // 获取单个艺术品
  app.get('/api/artworks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[Debug] 查询作品ID: ${id}`);

      // 尝试从数据库获取作品
      const artwork = await storage.getArtwork(parseInt(id));

      if (artwork) {
        // 转换一下字段名以匹配前端预期
        return res.json({
          id: artwork.id,
          title: artwork.title,
          description: artwork.description,
          imageUrl: artwork.image_url,
          videoUrl: artwork.video_url,
          isPremium: artwork.is_premium,
          hideTitle: artwork.hide_title,
          categoryId: artwork.category_id,
          imageId: artwork.id // 确保前端可以使用imageId
        });
      }

      return res.status(404).json({ error: `找不到ID为 ${id} 的作品` });
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