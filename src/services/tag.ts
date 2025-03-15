import { db } from '@/db';
import { tags as tagsTable } from '@/db/schema';

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export async function getAllTags(): Promise<Tag[]> {
  return await db.select().from(tagsTable);
}