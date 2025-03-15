import { db } from '@/db';
import { tags, images, imageTags } from '@/db/schema';
import { sql, eq, desc } from 'drizzle-orm';

export type Category = {
  name: string;
  slug: string;
  image: string;
  count: number;
};

export async function getCategories(): Promise<Category[]> {
  const tagsWithCounts = await db
    .select({
      name: tags.name,
      slug: tags.slug,
      count: sql<number>`count(distinct ${images.id})::int`,
      image: sql<string>`
        (SELECT ${images.objectUrl} 
         FROM ${images} 
         JOIN ${imageTags} ON ${images.id} = ${imageTags.imageId} 
         WHERE ${imageTags.tagId} = ${tags.id} 
         ORDER BY ${images.id} DESC 
         LIMIT 1)
      `,
    })
    .from(tags)
    .leftJoin(imageTags, eq(imageTags.tagId, tags.id))
    .leftJoin(images, eq(images.id, imageTags.imageId))
    .groupBy(tags.id, tags.name, tags.slug)
    .orderBy(desc(sql`count(distinct ${images.id})`))
    .limit(6);

  return tagsWithCounts.map(tag => ({
    name: tag.name,
    slug: tag.slug,
    image: tag.image || '/api/placeholder/400/400',
    count: tag.count || 0
  }));
}