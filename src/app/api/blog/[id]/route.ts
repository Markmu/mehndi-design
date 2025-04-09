import { NextRequest, NextResponse } from "next/server";
import { BlogPost } from "@/model/blog";

// Mock database (same as in the main blog route)
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "印度传统海娜纹身的历史与文化",
    slug: "history-of-henna",
    content:
      "<p>海娜纹身在印度文化中有着悠久的历史，通常在婚礼和重要节日中使用。</p><p>海娜（Henna）是一种从指甲花植物中提取的天然染料，用于在皮肤上创造精美的临时纹身。这种艺术形式在印度次大陆、中东和北非地区有着数千年的历史。</p>",
    excerpt:
      "海娜纹身在印度文化中有着悠久的历史，通常在婚礼和重要节日中使用...",
    coverImage: "/images/blog/henna-history.jpg",
    publishedAt: "2023-10-15",
    author: {
      name: "李明",
      avatar: "/images/authors/liming.jpg",
    },
    tags: ["历史", "文化", "传统"],
  },
  {
    id: 2,
    title: "初学者海娜纹身设计指南",
    slug: "beginners-guide",
    content:
      "<p>想要开始尝试海娜纹身设计？本文将为您提供从基础图案到高级技巧的全面指南。</p><p>首先，您需要准备的材料包括：优质的海娜粉、柠檬汁或茶树精油、锥形挤压瓶、棉签和纸巾。</p>",
    excerpt:
      "想要开始尝试海娜纹身设计？本文将为您提供从基础图案到高级技巧的全面指南...",
    coverImage: "/images/blog/beginners-guide.jpg",
    publishedAt: "2023-10-20",
    author: {
      name: "王芳",
      avatar: "/images/authors/wangfang.jpg",
    },
    tags: ["教程", "初学者", "设计"],
  },
];

// GET - Retrieve a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const post = blogPosts.find((p) => p.id === id);

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

    const postIndex = blogPosts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const data = await request.json();

    // Update post
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...data,
      id, // Ensure ID doesn't change
    };

    return NextResponse.json(blogPosts[postIndex]);
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
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const postIndex = blogPosts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  // Remove post
  blogPosts.splice(postIndex, 1);

  return NextResponse.json({ success: true });
}
