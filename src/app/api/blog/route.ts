import { NextRequest, NextResponse } from "next/server";
import { db, dbBlog } from "@/db";
import { blogPosts, blogTags, blogPostsTags } from "@/db/schema/blog";
import { eq } from "drizzle-orm";
import { listBlog } from "@/services/blog";

// GET - 获取所有博客文章
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get("tag");

    // 使用服务层函数获取博客列表
    const formattedPosts = await listBlog(tag);

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("获取博客文章失败:", error);
    return NextResponse.json({ error: "获取博客文章失败" }, { status: 500 });
  }
}

// POST - 创建新博客文章
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 验证必填字段
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    // 检查 slug 是否已存在
    const existingPost = await dbBlog.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, data.slug),
    });

    if (existingPost) {
      return NextResponse.json({ error: "文章 slug 已存在" }, { status: 400 });
    }

    // 开始事务
    const result = await dbBlog.transaction(async (tx) => {
      // 创建新文章
      const [newPost] = await tx
        .insert(blogPosts)
        .values({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || data.content.substring(0, 150) + "...",
          coverImage: data.coverImage || "/images/blog/default.jpg",
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt)
            : new Date(),
          authorName: data.author?.name || "Admin",
          authorAvatar: data.author?.avatar,
        })
        .returning();

      // 处理标签
      const tagNames = data.tags || [];
      for (const tagName of tagNames) {
        // 查找或创建标签
        let tag = await tx.query.blogTags.findFirst({
          where: eq(blogTags.name, tagName),
        });

        if (!tag) {
          const [newTag] = await tx
            .insert(blogTags)
            .values({ name: tagName })
            .returning();
          tag = newTag;
        }

        // 创建文章-标签关联
        await tx.insert(blogPostsTags).values({
          postId: newPost.id,
          tagId: tag.id,
        });
      }

      return newPost;
    });

    // 获取创建的文章及其标签
    const createdPost = result;
    const tagsResult = await db
      .select()
      .from(blogTags)
      .innerJoin(blogPostsTags, eq(blogTags.id, blogPostsTags.tagId))
      .where(eq(blogPostsTags.postId, createdPost.id));

    // 格式化返回数据
    const formattedPost = {
      id: createdPost.id,
      title: createdPost.title,
      slug: createdPost.slug,
      content: createdPost.content,
      excerpt: createdPost.excerpt,
      coverImage: createdPost.coverImage,
      publishedAt: createdPost.publishedAt,
      author: {
        name: createdPost.authorName,
        avatar: createdPost.authorAvatar || "",
      },
      tags: tagsResult.map((t) => t.blog_tags.name),
    };

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error("创建博客文章失败:", error);
    return NextResponse.json({ error: "创建博客文章失败" }, { status: 500 });
  }
}
