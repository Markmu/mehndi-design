import { NextRequest, NextResponse } from "next/server";
import { dbBlog } from "@/db";

// GET - Retrieve a blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = dbBlog.query.blogPosts.findFirst({
    where: (post, { eq }) => eq(post.slug, slug),
  });

  if (!post) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
