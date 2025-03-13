import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// 使用环境变量配置数据库连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool });