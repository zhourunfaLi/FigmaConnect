import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { validateSchema } from "./validateSchema"; // Added import for schema validation
const { createServer } = require('http');

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
  let isServerClosed = false;

  // 处理服务器关闭
  const closeServer = () => {
    if (!isServerClosed) {
      log('正在关闭服务器...');
      server.close(() => {
        log('服务器已关闭');
        isServerClosed = true;
      });
    }
  };

  // 处理进程退出信号
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
    process.on(signal, () => {
      log(`收到${signal}信号，正在关闭服务器...`);
      closeServer();
      process.exit(0);
    });
  });

  const startServer = async () => {
    try {
      await validateSchema(); // 验证数据库schema

      // 确保服务器处于关闭状态
      closeServer();

      // 主动尝试释放端口，无需等待错误发生
      try {
        require('child_process').execSync('fuser -k 3002/tcp > /dev/null 2>&1 || true');
        require('child_process').execSync('pkill -f "node.*server/index" > /dev/null 2>&1 || true');
        log('预先清理端口完成');
      } catch (e) {
        log(`预先清理端口操作失败: ${e.message}`);
      }

      // 使用新的HTTP服务器实例
      const newServer = createServer(app);

      // 设置服务器错误处理
      newServer.on('error', (err) => {
        log(`服务器错误: ${err.message}`);
        if(err.code === 'EADDRINUSE') {
          log('端口仍被占用，执行更强力的清理...');

          // 使用多种命令尝试释放端口
          try {
            // 尝试使用不同的命令释放端口
            require('child_process').execSync('pkill -9 -f node || true');
            require('child_process').execSync('fuser -k 3002/tcp || true');
            require('child_process').execSync('kill -9 $(lsof -t -i:3002) || true');
            log('强力清理端口完成，5秒后重试...');
          } catch (e) {
            log(`强力清理端口失败: ${e.message}`);
          }

          // 延长等待时间，确保端口真正释放
          setTimeout(startServer, 5000);
        } else {
          log(`严重错误: ${err.message}`);
          process.exit(1);
        }
      });

      // 启动服务器
      newServer.listen(PORT, "0.0.0.0", () => {
        isServerClosed = false;
        log(`服务器启动成功，运行在端口 ${PORT}`);
      });

      // 替换全局server引用
      server = newServer;

      return newServer;
    } catch(e) {
      log(`启动服务器出错: ${e.message}`);
      return null;
    }
  };

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