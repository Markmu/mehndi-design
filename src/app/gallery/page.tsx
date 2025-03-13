'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import TagList from '@/components/tag-list';
import ImageGrid from '@/components/image-grid';

type Tag = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type Image = {
  id: number;
  name: string;
  objectUrl: string;
  tags: {
    id: number;
    name: string;
  }[];
};

type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag');

  const [tags, setTags] = useState<Tag[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0
  });

  // 加载标签
  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error('加载标签失败:', error);
      }
    }

    loadTags();
  }, []);

  // 加载图片
  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      try {
        // 构建带分页参数的 URL
        const tag = tagParam || 'all';
        const url = `/api/images?page=${pagination.page}&pageSize=${pagination.pageSize}&tag=${tag}`;

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          setImages(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error('加载图片失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [tagParam, pagination.page, pagination.pageSize]); // 当标签参数或分页参数变化时重新加载图片

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#2D1810] mb-8">Henna 设计画廊</h1>
          
          {/* 标签列表 */}
          <TagList tags={tags} selectedTag={tagParam || undefined} />
          
          {/* 图片网格 */}
          <ImageGrid images={images} loading={loading} />
          
          {/* 分页控件 */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
                  }`}
                >
                  上一页
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    Math.abs(page - pagination.page) <= 1
                  )
                  .map((page, index, array) => {
                    // 添加省略号
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-3 py-1">
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          pagination.page === page
                            ? 'bg-[#7E4E3B] text-white'
                            : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                
                <button
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    pagination.page === pagination.totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
                  }`}
                >
                  下一页
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}