import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as blogSchema from './schema/blog';
import * as imageSchema from './schema/image';

// 使用环境变量配置数据库连接
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const db = drizzle({ client: pool});

export const dbBlog = drizzle({client: pool, schema: blogSchema});
export const dbImage = drizzle({client: pool, schema: imageSchema});
