'use client';

import { useEffect, useState } from 'react';
import Toast from '@/components/toast';

type Image = {
  id: number;
  name: string;
  objectUrl: string;
  tags: {
    id: number;
    name: string;
  }[];
};

type Tag = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // 加载图片
  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      try {
        const response = await fetch(`/api/images?page=${page}&pageSize=20&tag=all`);
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
  }, [page]);

  // 加载所有标签
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

  // 选择图片进行编辑
  const handleSelectImage = (image: Image) => {
    setSelectedImage(image);
    setSelectedTags(image.tags.map(tag => tag.id));
  };

  // 切换标签选择状态
  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 保存标签更改
  const saveTagChanges = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/images/${selectedImage.id}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagIds: selectedTags }),
      });

      if (response.ok) {
        // 更新本地图片数据
        setImages(prev => 
          prev.map(img => 
            img.id === selectedImage.id
              ? {
                  ...img,
                  tags: allTags
                    .filter(tag => selectedTags.includes(tag.id))
                    .map(tag => ({ id: tag.id, name: tag.name }))
                }
              : img
          )
        );
        
        // 更新选中的图片
        setSelectedImage(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tags: allTags
              .filter(tag => selectedTags.includes(tag.id))
              .map(tag => ({ id: tag.id, name: tag.name }))
          };
        });
        
        // 显示成功提示
        setToast({
          show: true,
          message: '标签更新成功',
          type: 'success'
        });
      } else {
        // 显示错误提示
        setToast({
          show: true,
          message: '标签更新失败',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('保存标签失败:', error);
      setToast({
        show: true,
        message: '保存标签失败',
        type: 'error'
      });
    }
  };

  // 关闭 Toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50">
        {/* Toast 组件 */}
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={closeToast} 
          />
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#2D1810] mb-8">图片标签管理</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 图片列表 */}
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">图片列表</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E4E3B]"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {images.map(image => (
                      <div 
                        key={image.id}
                        className={`flex items-center p-2 rounded cursor-pointer ${
                          selectedImage?.id === image.id ? 'bg-[#FDF7F4] border border-[#7E4E3B]' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleSelectImage(image)}
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
                    ))}
                  </div>
                  
                  {/* 分页控件 */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded bg-gray-100 text-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      上一页
                    </button>
                    <span className="mx-4">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded bg-gray-100 text-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      下一页
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* 标签编辑区 */}
            <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
              {selectedImage ? (
                <>
                  <div className="flex items-start mb-6">
                    <img 
                      src={selectedImage.objectUrl} 
                      alt={selectedImage.name}
                      className="w-80 h-80 object-cover rounded mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{selectedImage.name}</h2>
                      <p className="text-gray-500 mb-2">ID: {selectedImage.id}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {selectedImage.tags.map(tag => (
                          <span 
                            key={tag.id}
                            className="inline-block px-2 py-1 text-xs bg-[#FDF7F4] text-[#7E4E3B] rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-3">编辑标签</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {allTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag.id)
                            ? 'bg-[#7E4E3B] text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={saveTagChanges}
                    className="px-4 py-2 bg-[#7E4E3B] text-white rounded hover:bg-[#6D3D2A]"
                  >
                    保存更改
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  请从左侧选择一张图片进行编辑
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}