import { NextResponse } from 'next/server';
import { db } from '@/db';
import { imageTags, tags } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {

    const countByTagId = await db.select({
      tagId: imageTags.tagId,
      count: sql<number>`count(imageId)::int`,
    })
    .from(imageTags)
    .groupBy(imageTags.tagId);

    const tagInfos = await db.select({
      tagId: tags.id,
      tagName: tags.name,
    })
    .from(tags);

    const tagCounts = tagInfos?.map(t => {
      return {
        tagId: t.tagId,
        tagName: t.tagName,
        count: countByTagId.find(tc => tc.tagId === t.tagId)?.count ?? 0
      };
    });

    return NextResponse.json(tagCounts);
  } catch (error) {
    console.error('获取类别统计失败:', error);
    return NextResponse.json({ error: '获取类别统计失败' }, { status: 500 });
  }
}