import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { imageTags, tags } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const imageId = parseInt((await params).id);
    if (isNaN(imageId)) {
      return NextResponse.json({ error: '无效的图片ID' }, { status: 400 });
    }

    const { tagIds } = await req.json();
    if (!Array.isArray(tagIds)) {
      return NextResponse.json({ error: '标签ID必须是数组' }, { status: 400 });
    }

    // 开始数据库事务
    await db.transaction(async (tx) => {
      // 1. 删除该图片的所有现有标签关联
      await tx.delete(imageTags).where(eq(imageTags.imageId, imageId));

      // 2. 添加新的标签关联
      if (tagIds.length > 0) {
        const values = tagIds.map(tagId => ({
          imageId,
          tagId,
        }));
        await tx.insert(imageTags).values(values);
      }
    });

    // 获取更新后的标签
    const updatedTags = await db.select({
      id: tags.id,
      name: tags.name,
    })
    .from(tags)
    .innerJoin(imageTags, and(
      eq(imageTags.tagId, tags.id),
      eq(imageTags.imageId, imageId)
    ));

    return NextResponse.json(updatedTags);
  } catch (error) {
    console.error('更新图片标签失败:', error);
    return NextResponse.json({ error: '更新图片标签失败' }, { status: 500 });
  }
}