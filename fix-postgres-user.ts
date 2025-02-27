
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { pool, db } from "./server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  try {
    console.log("连接到PostgreSQL数据库...");
    
    // 测试连接
    const result = await pool.query("SELECT NOW()");
    console.log("数据库连接成功:", result.rows[0]);
    
    // 为test用户生成正确格式的密码
    const password = 'test123';
    const hashedPassword = await hashPassword(password);
    
    // 检查test用户是否存在
    const existingUser = await db.select().from(users).where(eq(users.username, 'test'));
    
    if (existingUser.length === 0) {
      console.log("用户'test'不存在，创建新用户");
      
      // 创建test用户
      const newUser = await db.insert(users).values({
        username: 'test',
        password: hashedPassword,
        isPremium: true
      }).returning();
      
      console.log("已创建新用户:", newUser);
    } else {
      console.log("用户'test'已存在，更新密码");
      
      // 更新用户密码
      const updatedUser = await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.username, 'test'))
        .returning();
      
      console.log("已更新用户:", updatedUser);
    }
    
    // 打印所有用户
    const allUsers = await db.select().from(users);
    console.log("数据库中的所有用户:", allUsers);
    
  } catch (error) {
    console.error('执行过程中出错:', error);
  } finally {
    // 关闭数据库连接
    await pool.end();
  }
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
