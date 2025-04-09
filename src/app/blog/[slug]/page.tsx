import { notFound } from 'next/navigation';
import { BlogPost } from '@/model/blog';

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blog/slug/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-500">{post.publishedAt}</span>
          <span className="mx-2 text-gray-300">•</span>
          <div className="flex items-center">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-6 h-6 rounded-full mr-2"
              />
            )}
            <span className="text-sm text-gray-500">{post.author.name}</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#2D1810] mb-6">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs bg-[#FDF7F4] text-[#7E4E3B] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none prose-headings:text-[#2D1810] prose-a:text-[#7E4E3B]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-[#2D1810] mb-4">相关文章</h3>
        {/* Related articles component can be added here */}
      </div>
    </div>
  );
}