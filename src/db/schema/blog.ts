import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// 博客文章表
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  coverImage: varchar('cover_image', { length: 255 }).notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorAvatar: varchar('author_avatar', { length: 255 }),
});

// 标签表
export const blogTags = pgTable('blog_tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
});

// 文章-标签关联表
export const blogPostsTags = pgTable('blog_posts_tags', {
  id: serial('id').primaryKey(),
  postId: serial('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }),
  tagId: serial('tag_id').references(() => blogTags.id, { onDelete: 'cascade' }),
});


export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;
export type BlogPostTag = typeof blogPostsTags.$inferSelect;
export type NewBlogPostTag = typeof blogPostsTags.$inferInsert;