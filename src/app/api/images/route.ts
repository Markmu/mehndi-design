import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { images, imageTags, tags } from "@/db/schema/image";
import { eq, and, sql, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // params
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 20;
    const tagSlug = searchParams.get("tag") || "all";

    // offet
    const offset = (page - 1) * pageSize;

    const imagesSelect = db
    .select({
      id: images.id,
      name: images.name,
      objectUrl: images.objectUrl,
      createdAt: images.createdAt,
    })
    .from(images);

    let query = null;
    // filter if with tag params
    if (tagSlug === "none") {
      // Query images that have no tags
      query = imagesSelect
        .leftJoin(imageTags, eq(imageTags.imageId, images.id))
        .where(sql`${imageTags.imageId} IS NULL`);
    } else if (tagSlug !== "all") {
      // Query images with specific tag
      query = imagesSelect
        .innerJoin(imageTags, eq(imageTags.imageId, images.id))
        .innerJoin(
          tags,
          and(eq(tags.id, imageTags.tagId), eq(tags.slug, tagSlug))
        );
    } else {
      // Query all images
      query = imagesSelect;
    }

    // 执行查询获取总数
    const countResult = await db
      .select({
        count: sql`count(*)`.as("count"),
      })
      .from(query.as("filtered_images"));

    const totalItems = Number(countResult[0].count);
    const totalPages = Math.ceil(totalItems / pageSize);

    // pagenation
    const imagesResult = await query
      .orderBy(desc(images.id))
      .limit(pageSize)
      .offset(offset);

    // get tags
    const imagesWithTags = await Promise.all(
      imagesResult.map(async (image) => {
        const imageTags_result = await db
          .select({
            id: tags.id,
            name: tags.name,
          })
          .from(tags)
          .innerJoin(
            imageTags,
            and(eq(imageTags.tagId, tags.id), eq(imageTags.imageId, image.id))
          );

        return {
          ...image,
          tags: imageTags_result,
        };
      })
    );

    // result
    return NextResponse.json({
      data: imagesWithTags,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("fail to fetch images:", error);
    return NextResponse.json({ error: "fail to fetch images" }, { status: 500 });
  }
}
