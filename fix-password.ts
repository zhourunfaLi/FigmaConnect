
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Pool } from "pg";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  // 连接数据库
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // 为test用户生成正确格式的密码
    const password = 'test123';
    const hashedPassword = await hashPassword(password);
    
    // 更新用户密码
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING *',
      [hashedPassword, 'test']
    );
    
    console.log('密码更新成功:', result.rows[0]);
  } catch (error) {
    console.error('更新密码时出错:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
