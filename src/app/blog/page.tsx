import Link from 'next/link';
import { BlogPost } from '@/model/blog';


export default async function BlogPage() {
  const posts = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#2D1810] mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无博客文章</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* 封面图片区域 */}
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* 文章信息区域 */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-[#2D1810] mb-2 group-hover:text-[#7E4E3B] line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.publishedAt}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 text-xs bg-[#FDF7F4] text-[#7E4E3B] rounded-full"
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