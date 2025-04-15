import { NextRequest, NextResponse } from "next/server";
import { blogPosts } from "@/db/schema/blog";
import { dbBlog } from "@/db";
import { eq } from "drizzle-orm";



// GET - Retrieve a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const post = await dbBlog.query.blogPosts.findFirst({
    where: (post, { eq }) => eq(post.id, id),
  });

  if (!post) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT - Update a specific blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const post = await dbBlog.query.blogPosts.findFirst({
      where: (post, { eq }) => eq(post.id, id),
    })

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    // 更新博客文章
    const updatedPost = await dbBlog
      .update(blogPosts)
      .set({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // 检查博客文章是否存在
    const post = await dbBlog.query.blogPosts.findFirst({
      where: (post, { eq }) => eq(post.id, id),
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // 从数据库中删除博客文章
    await dbBlog
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
