'use client';

import { useState, useEffect } from 'react';
import Pagination from '@/components/pagination';
import { Tag } from '@/model/tag';

type Image = {
  id: number;
  name: string;
  objectUrl: string;
  tags: {
    id: number;
    name: string;
  }[];
};

interface ImageListProps {
  selectedImage: Image | null;
  onSelectImage: (image: Image) => void;
  updateTrigger?: number; // 添加可选的更新触发器
}

export default function ImageList({
  selectedImage,
  onSelectImage,
  updateTrigger = 0
}: ImageListProps) {
  // 内部状态管理
  const [images, setImages] = useState<Image[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 加载标签数据
  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setAllTags(data);
        }
      } catch (error) {
        console.error('加载标签失败:', error);
      }
    }

    loadTags();
  }, []);

  // 加载图片数据
  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      try {
        // 构建查询参数
        let url = `/api/images?page=${page}&pageSize=5`;

        if (selectedTag === null) {
          url += '&tag=all';
        } else {
          url += `&tag=${selectedTag}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          setImages(result.data);
          setTotalPages(result.pagination.totalPages);
        }
      } catch (error) {
        console.error('加载图片失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [page, selectedTag, updateTrigger]); // 添加 updateTrigger 作为依赖

  // 处理标签筛选变化
  const handleTagFilterChange = (tagSlug: string | null) => {
    setSelectedTag(tagSlug);
    setPage(1); // 重置页码
  };

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Images</h2>

        {/* 标签筛选下拉框 */}
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B]"
            value={selectedTag === null ? 'all' : selectedTag}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') {
                handleTagFilterChange(null);
              } else {
                handleTagFilterChange(value);
              }
            }}
          >
            <option value="all">All</option>
            <option value="none">None</option>
            {allTags.map(tag => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E4E3B]"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {images.length > 0 ? (
              images.map(image => (
                <div
                  key={image.id}
                  className={`flex items-center p-2 rounded cursor-pointer ${selectedImage?.id === image.id ? 'bg-[#FDF7F4] border border-[#7E4E3B]' : 'hover:bg-gray-100'
                    }`}
                  onClick={() => onSelectImage(image)}
                >
                  <img
                    src={image.objectUrl}
                    alt={image.name}
                    className="w-32 h-32 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-gray-500">{image.tags.length} 个标签</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-32 text-gray-500">
                没有找到符合条件的图片
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}