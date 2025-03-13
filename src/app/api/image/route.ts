import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { images, tags, imageTags } from '@/db/schema';
import { uploadImageToR2 } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { Tag } from '@/model/tag';

// 上传新图片
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const tagsString = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: 'file not found' }, { status: 400 });
    }

    // 解析标签
    const tagNames = tagsString?.split(',').map(tag => tag.trim()).filter(Boolean);

    // 生成唯一的对象键
    const objectKey = `images/${uuidv4()}`;

    // 将文件转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 上传到 R2 并获取 URL
    const objectUrl = await uploadImageToR2(buffer, objectKey, file.type);

    // 开始数据库事务
    const result = await db.transaction(async (tx) => {
      // 1. 保存图片信息
      const [newImage] = await tx.insert(images).values({
        name: file.name,
        objectKey,
        objectUrl,
        description,
      }).returning();

      // 2. 处理标签
      const imageWithTags = { ...newImage, tags: [] as Tag[] };

      tagNames?.forEach( async (tagName) => {
        // 标签名转为小写并创建 slug
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');

        // 查找或创建标签
        let tag = await tx.select().from(tags).where(eq(tags.slug, tagSlug)).limit(1);

        if (tag.length === 0) {
          // 创建新标签
          const [newTag] = await tx.insert(tags).values({
            name: tagName,
            slug: tagSlug
          }).returning();

          tag = [newTag];
        }

        // 创建图片-标签关联
        await tx.insert(imageTags).values({
          imageId: newImage.id,
          tagId: tag[0].id,
        });

        imageWithTags.tags.push(tag[0]);
      })

      return imageWithTags;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('上传图片失败:', error);
    return NextResponse.json({ error: 'Fail to upload' }, { status: 500 });
  }
}