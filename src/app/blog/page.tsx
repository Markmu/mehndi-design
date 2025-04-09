import Link from 'next/link';
import { BlogPost } from '@/model/blog';

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog');

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#2D1810] mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">404</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform group-hover:shadow-lg">
                <div className="relative h-48 w-full">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-500">{post.publishedAt}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{post.author.name}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-[#2D1810] mb-2 group-hover:text-[#7E4E3B]">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-[#FDF7F4] text-[#7E4E3B] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}