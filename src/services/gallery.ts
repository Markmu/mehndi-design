import { db } from '@/db';
import { tags as tagsTable, images as imagesTable, imageTags } from '@/db/schema/image';
import { sql, eq, desc } from 'drizzle-orm';

export type Tag = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export type Image = {
  id: number;
  name: string;
  objectUrl: string | null;
  tags: {
    id: number;
    name: string;
  }[];
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export async function getTags() {
  return await db.select().from(tagsTable);
}

export async function getGalleryData(page: number, pageSize: number, tagSlug: string) {
  // 获取图片总数
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(imagesTable)
    .leftJoin(imageTags, eq(imageTags.imageId, imagesTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, imageTags.tagId))
    .where(tagSlug === 'all' ? undefined : eq(tagsTable.slug, tagSlug));

  // 获取当前页的图片
  const images = await db
    .select({
      id: imagesTable.id,
      name: imagesTable.name,
      objectUrl: imagesTable.objectUrl,
      tags: sql<{ id: number; name: string }[]>`
        array_agg(json_build_object('id', ${tagsTable.id}, 'name', ${tagsTable.name}))
      `,
    })
    .from(imagesTable)
    .leftJoin(imageTags, eq(imageTags.imageId, imagesTable.id))
    .leftJoin(tagsTable, eq(tagsTable.id, imageTags.tagId))
    .where(tagSlug === 'all' ? undefined : eq(tagsTable.slug, tagSlug))
    .groupBy(imagesTable.id)
    .orderBy(desc(imagesTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalPages = Math.ceil(count / pageSize);

  return {
    images,
    pagination: {
      page,
      pageSize,
      total: count,
      totalPages
    }
  };
}