import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { validateSchema } from "./validateSchema";
import initTestData from './initTestData';
import { checkDatabaseConnection } from './db';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
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
  try {
    server = registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error(err);
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // 固定使用端口5000
    const PORT = 5000;

    // 检查数据库连接
    await checkDatabaseConnection()
      .then(async (isConnected) => {
        if (isConnected) {
          console.log('数据库连接成功');
          try {
            await initTestData();
            console.log('测试数据初始化成功');
          } catch (initError) {
            console.error('测试数据初始化失败:', initError);
          }
        } else {
          console.error('无法连接到数据库');
          throw new Error('数据库连接失败');
        }
      })
      .catch((dbError) => {
        console.error('数据库连接或测试数据初始化错误:', dbError);
        process.exit(1);
      });

    // 启动服务器
    await validateSchema();
    server.listen(PORT, "0.0.0.0", () => {
      log(`服务器启动成功，运行在端口 ${PORT}`);
      log(`访问地址: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    });

    // 错误处理
    server.on('error', (err: any) => {
      log(`服务器错误: ${err.message}`);
      process.exit(1);
    });

    // 进程退出处理
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
      if (server) {
        server.close(() => {
          log('由于严重错误，服务器已关闭');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

  } catch (err: any) {
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