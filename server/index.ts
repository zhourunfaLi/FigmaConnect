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
  let server;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  try {
    server = registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const BASE_PORT = 9000;
    let currentPort = BASE_PORT;
    let serverStarted = false;

    // 确保之前的进程已结束
    try {
      const killPortProcess = require('kill-port');
      await killPortProcess(BASE_PORT);
      console.log(`已尝试释放端口 ${BASE_PORT}`);
    } catch (err) {
      console.log(`端口释放错误 (可忽略): ${err.message}`);
    }

    const startServer = async () => {
      if (serverStarted) {
        log(`服务器已经在运行中，不需要重新启动`);
        return;
      }

      if (retryCount >= MAX_RETRIES) {
        log(`已达到最大重试次数 (${MAX_RETRIES})，尝试使用端口 ${currentPort + 1}...`);
        currentPort = BASE_PORT + 1;
      }

      try {
        await validateSchema();

        // 创建一个Promise包装的server.listen操作
        const startPromise = new Promise((resolve, reject) => {
          const startTimeout = setTimeout(() => {
            reject(new Error(`启动服务器超时（端口: ${currentPort}）`));
          }, 5000); // 5秒超时

          const serverInstance = server.listen(currentPort, "0.0.0.0", () => {
            clearTimeout(startTimeout);
            log(`服务器启动成功，运行在端口 ${currentPort}`);
            log(`访问地址: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
            serverStarted = true;
            retryCount = 0; // 重置重试计数
            resolve(true);
          });

          serverInstance.on('error', (err) => {
            clearTimeout(startTimeout);
            reject(err);
          });
        });

        await startPromise;
      } catch(e) {
        log(`启动服务器出错: ${e.message}`);
        if (e.code === 'EADDRINUSE') {
          retryCount++;
          currentPort++; // 递增端口号
          log(`端口 ${currentPort - 1} 被占用，尝试端口 ${currentPort}，重试 ${retryCount}/${MAX_RETRIES}...`);
          if (retryCount <= MAX_RETRIES * 2) {
            setTimeout(startServer, 1000);
          } else {
            log(`多次尝试失败，退出进程`);
            process.exit(1);
          }
        } else {
          log(`严重错误: ${e.message}`);
          process.exit(1);
        }
      }
    };

    // 处理服务器错误
    server.on('error', (err) => {
      log(`服务器错误: ${err.message}`);
      if(err.code === 'EADDRINUSE') {
        retryCount++;
        log(`端口被占用，重试 ${retryCount}/${MAX_RETRIES}...`);
        setTimeout(startServer, 3000);
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

    process.on('uncaughtException', (err) => {
      log(`未捕获的异常: ${err.message}`);
      log(err.stack || '无堆栈信息');

      // 对于数据库连接错误，我们尝试处理而不是立即退出
      if (err.message.includes('terminating connection due to administrator command') ||
          err.message.includes('Connection terminated unexpectedly')) {
        log('数据库连接被中断，这可能是由于Neon数据库自动休眠导致的');
        // 这里不退出进程，因为连接池会自动处理重连
      } else {
        // 对于其他未捕获的异常，我们仍然关闭服务器
        if (server) {
          server.close(() => {
            log('由于严重错误，服务器已关闭');
            process.exit(1);
          });
        } else {
          process.exit(1);
        }
      }
    });

    startServer();
  } catch (err) {
    log(`服务器初始化错误: ${err.message}`);
    process.exit(1);
  }
})();


// Placeholder for schema validation function.  Replace with actual implementation.
async function validateSchema() {
  console.log("Performing schema validation...");
  // Add your schema validation logic here.  This is a placeholder.
  // For example, you might compare database schema with a definition file.
  // Throw an error if the schema is invalid.
  return Promise.resolve();
}