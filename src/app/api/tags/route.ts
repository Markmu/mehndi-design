import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tags } from '@/db/schema/image';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    // 只查询标签表的基本信息
    const allTags = await db.select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(tags)
    .orderBy(asc(tags.name)); // 按标签名称字母顺序排序

    return NextResponse.json(allTags);
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 });
  }
}