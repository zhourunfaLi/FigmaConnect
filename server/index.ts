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

  const BASE_PORT = 3002;
  const MAX_PORT = 3010; // 尝试的最大端口号
  const MAX_RETRY = 5;
  let currentPort = BASE_PORT;
  let retryCount = 0;
  
  // 检查端口是否被占用
  const isPortInUse = (port) => {
    return new Promise((resolve) => {
      import('net').then(netModule => {
        const net = netModule.default;
        const tester = net.createServer()
          .once('error', () => resolve(true))
          .once('listening', () => {
            tester.close();
            resolve(false);
          })
          .listen(port, '0.0.0.0');
      });
    });
  };
  
  // 查找下一个可用端口
  const findAvailablePort = async () => {
    let port = currentPort;
    
    // 尝试从当前端口到最大端口
    while (port <= MAX_PORT) {
      log(`尝试端口 ${port}...`);
      const inUse = await isPortInUse(port);
      if (!inUse) {
        return port;
      }
      port++;
    }
    
    // 如果所有端口都被占用，重置到初始端口并等待
    log(`所有端口 ${BASE_PORT}-${MAX_PORT} 都被占用，等待释放...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    return BASE_PORT;
  };
  
  const startServer = async () => {
    try {
      await validateSchema(); // 执行模式验证
      
      // 查找可用端口
      currentPort = await findAvailablePort();
      
      // 确保关闭现有服务器
      if (server.listening) {
        server.close();
      }
      
      // 启动服务器
      server.listen(currentPort, "0.0.0.0", () => {
        retryCount = 0; // 重置重试计数
        log(`服务器启动成功，运行在端口 ${currentPort}`);
      });
    } catch(e) {
      log(`启动服务器出错: ${e.message}`);
    }
  }

  // 处理服务器错误
  server.on('error', async (err) => {
    log(`服务器错误: ${err.message}`);
    if(err.code === 'EADDRINUSE') {
      if (retryCount < MAX_RETRY) {
        retryCount++;
        log(`端口 ${currentPort} 被占用，尝试使用其他端口... (尝试 ${retryCount}/${MAX_RETRY})`);
        // 增加端口号，尝试下一个
        currentPort++;
        if (currentPort > MAX_PORT) currentPort = BASE_PORT;
        setTimeout(startServer, 1000); 
      } else {
        log(`尝试 ${MAX_RETRY} 次后仍无法启动服务器，请手动重启项目`);
        process.exit(1);
      }
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