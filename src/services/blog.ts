import { db, dbBlog } from "@/db";
import { blogPosts, blogTags, blogPostsTags } from "@/db/schema/blog";
import { desc, eq } from "drizzle-orm";
import moment from "moment";
import { BlogPost } from "@/model/blog";

/**
 * 获取博客文章列表
 * @param tag 可选的标签过滤
 * @returns 格式化后的博客文章列表
 */
export async function listBlog(tag?: string | null): Promise<BlogPost[]> {
  // 基本查询
  let query = dbBlog.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.publishedAt)],
  });

  // 如果指定了标签过滤
  if (tag && tag !== "all") {
    query = dbBlog.query.blogPosts.findMany({
      where: (posts, { eq, exists }) =>
        exists(
          db
            .select()
            .from(blogPostsTags)
            .where(eq(blogPostsTags.postId, posts.id))
            .innerJoin(blogTags, eq(blogTags.id, blogPostsTags.tagId))
          // .where(eq(blogTags.name, tag))
        ),
      orderBy: [desc(blogPosts.publishedAt)],
    });
  }

  const posts = await query;

  // 获取每篇文章的标签
  const formattedPosts = await Promise.all(
    posts.map(async (post) => {
      const tags = await db
        .select({
          name: blogTags.name,
        })
        .from(blogTags)
        .innerJoin(blogPostsTags, eq(blogTags.id, blogPostsTags.tagId))
        .where(eq(blogPostsTags.postId, post.id));

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        publishedAt: moment(post.publishedAt).format("YYYY-MM-DD HH:mm:ss"),
        author: {
          name: post.authorName || "",
          avatar: post.authorAvatar || "",
        },
        tags: tags.map((tag) => tag.name),
      };
    })
  );

  return formattedPosts;
}

/**
 * 根据 slug 获取博客文章
 * @param slug 文章的 slug
 * @returns 博客文章或 null
 */
export async function getBlogBySlug(slug: string) {
  try {
    const post = await dbBlog.query.blogPosts.findFirst({
      where: (posts, { eq }) => eq(posts.slug, slug),
    });

    if (!post) {
      return null;
    }

    // 获取文章标签
    const tags = await db
      .select({
        name: blogTags.name,
      })
      .from(blogTags)
      .innerJoin(blogPostsTags, eq(blogTags.id, blogPostsTags.tagId))
      .where(eq(blogPostsTags.postId, post.id));

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      publishedAt: moment(post.publishedAt).format("YYYY-MM-DD HH:mm:ss"),
      author: {
        name: post.authorName,
        avatar: post.authorAvatar,
      },
      tags: tags.map((tag) => tag.name),
    };
  } catch (error) {
    console.error("获取博客文章失败:", error);
    return null;
  }
}
