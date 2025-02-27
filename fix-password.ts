
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Database } from "sqlite3";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  // 连接到SQLite数据库
  const db = new Database("mydb.sqlite", (err) => {
    if (err) {
      console.error("数据库连接错误:", err);
      process.exit(1);
    }
  });

  try {
    // 为test用户生成正确格式的密码
    const password = 'test123';
    const hashedPassword = await hashPassword(password);
    
    // 更新用户密码
    db.run(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'test'],
      function(err) {
        if (err) {
          console.error('更新密码时出错:', err);
          return;
        }
        
        console.log(`更新成功，影响的行数: ${this.changes}`);
        
        // 验证更新
        db.get('SELECT * FROM users WHERE username = ?', ['test'], (err, row) => {
          if (err) {
            console.error('查询用户失败:', err);
            return;
          }
          
          console.log('用户已更新:', row);
          // 关闭数据库连接
          db.close();
        });
      }
    );
  } catch (error) {
    console.error('执行过程中出错:', error);
    db.close();
  }
}

main().catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
