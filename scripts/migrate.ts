import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 数据库连接配置
const connectionString = `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

// 创建 postgres 客户端
const sql = postgres(connectionString, { max: 1 });

// 初始化 drizzle
const db = drizzle(sql);

// 执行迁移
async function main() {
  try {
    console.log('开始执行数据库迁移...');
    
    // 执行迁移，指定迁移文件所在目录
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('数据库迁移成功完成！');
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await sql.end();
    process.exit(0);
  }
}

main();