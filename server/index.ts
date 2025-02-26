import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { validateSchema } from "./validateSchema"; // Added import for schema validation

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 3002;
  const startServer = async () => {
    try {
      await validateSchema(); // Added schema validation before server start
      server.close(); // 确保先关闭之前的连接
      server.listen(PORT, "0.0.0.0", () => {
        log(`服务器启动成功，运行在端口 ${PORT} (对外端口5000)`);
      });
    } catch(e) {
      log(`启动服务器出错: ${e.message}`);
    }
  }

  // 处理服务器错误
  server.on('error', (err) => {
    log(`服务器错误: ${err.message}`);
    if(err.code === 'EADDRINUSE') {
      log('端口被占用，等待释放...');
      setTimeout(startServer, 3000); // 增加等待时间到3秒
    } else {
      log(`严重错误: ${JSON.stringify(err)}`);
      process.exit(1);
    }
  });

  // 处理进程退出
  process.on('SIGTERM', () => {
    log('收到退出信号，正在关闭服务器...');
    server.close(() => {
      log('服务器已安全关闭');
      process.exit(0);
    });
  });

  startServer();
})();


// Placeholder for schema validation function.  Replace with actual implementation.
async function validateSchema() {
  console.log("Performing schema validation...");
  // Add your schema validation logic here.  This is a placeholder.
  // For example, you might compare database schema with a definition file.
  // Throw an error if the schema is invalid.
  return Promise.resolve();
}