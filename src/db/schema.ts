import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';


// 图片表
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  objectKey: varchar('object_key', { length: 255 }).notNull(),
  objectUrl: text('object_url'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 标签表
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique()
});

// 图片-标签关联表
export const imageTags = pgTable('image_tags', {
  id: serial('id').primaryKey(),
  imageId: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

// 类型定义
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type ImageTag = typeof imageTags.$inferSelect;
export type NewImageTag = typeof imageTags.$inferInsert;