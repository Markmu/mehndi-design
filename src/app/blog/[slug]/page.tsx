import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogBySlug } from '@/services/blog';
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    alternates: {
      canonical: process.env.HOST + "blog/" + params.slug,
    },
  }
}

export default async function BlogDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const { slug } = params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="text-[#7E4E3B] hover:text-[#6D3D2A] flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </Link>
      </div>

      {/* 文章标题和元信息 */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2D1810] mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500 mb-4">
          <span>{post.publishedAt}</span>
          <span className="mx-2">•</span>
          <span>{post.author.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-block px-3 py-1 text-sm bg-[#FDF7F4] text-[#7E4E3B] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 封面图片 */}
      <div className="mb-8">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* 文章内容 */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}