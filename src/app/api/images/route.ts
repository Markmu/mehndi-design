import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { images, tags, imageTags } from '@/db/schema';
import { eq, inArray, sql, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const tagParam = req.nextUrl.searchParams.get('tag');
    // 获取分页参数，默认第一页，每页12条
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') || '12');
    
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    
    // 基本查询 - 获取所有图片及其标签
    let query = db.select({
      id: images.id,
      name: images.name,
      objectUrl: images.objectUrl,
      description: images.description,
      tags: sql<{ id: number, name: string }[]>`
        COALESCE(
          json_agg(
            json_build_object('id', ${tags.id}, 'name', ${tags.name})
          ) FILTER (WHERE ${tags.id} IS NOT NULL),
          '[]'
        )
      `,
    })
    .from(images)
    .leftJoin(imageTags, eq(images.id, imageTags.imageId))
    .leftJoin(tags, eq(imageTags.tagId, tags.id))
    .groupBy(images.id)
    .orderBy(desc(images.id)) // 按ID降序排列，最新添加的图片排在前面
    .limit(pageSize)
    .offset(offset);
    
    // 如果指定了标签且不是 'all'，筛选包含该标签的图片
    if (tagParam && tagParam !== 'all') {
      const tagResult = await db.select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, tagParam))
        .limit(1);
      
      if (tagResult.length > 0) {
        const tagId = tagResult[0].id;
        
        // 查找包含该标签的所有图片ID
        const imageIdsResult = await db.select({ imageId: imageTags.imageId })
          .from(imageTags)
          .where(eq(imageTags.tagId, tagId));
        
        const imageIds = imageIdsResult.map(item => item.imageId);
        
        if (imageIds.length > 0) {
          query = query.where(inArray(images.id, imageIds));
        } else {
          return NextResponse.json({
            data: [],
            pagination: {
              page,
              pageSize,
              total: 0,
              totalPages: 0
            }
          });
        }
      } else {
        return NextResponse.json({
          data: [],
          pagination: {
            page,
            pageSize,
            total: 0,
            totalPages: 0
          }
        });
      }
    }
    
    // 获取总记录数以计算总页数
    let countQuery = db.select({
      count: sql<number>`count(distinct ${images.id})::int`,
    })
    .from(images);
    
    // 如果有标签筛选，也需要应用到计数查询中
    if (tagParam && tagParam !== 'all') {
      const tagResult = await db.select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, tagParam))
        .limit(1);
      
      if (tagResult.length > 0) {
        const tagId = tagResult[0].id;
        
        countQuery = countQuery
          .leftJoin(imageTags, eq(images.id, imageTags.imageId))
          .where(eq(imageTags.tagId, tagId));
      }
    }
    
    const [countResult] = await countQuery;
    const total = countResult?.count || 0;
    const totalPages = Math.ceil(total / pageSize);
    
    const result = await query;
    
    return NextResponse.json({
      data: result,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('获取图片失败:', error);
    return NextResponse.json({ error: '获取图片失败' }, { status: 500 });
  }
}