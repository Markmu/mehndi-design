'use client';

import { useEffect, useState } from 'react';
import Toast from '@/components/toast';
import Pagination from '@/components/pagination';
import ImageUploader from '@/components/image-uploader';
import { signOut } from "next-auth/react";

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
        console.error('fail to load images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [page]);

  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setAllTags(data);
        }
      } catch (error) {
        console.error('fail to load tags:', error);
      }
    }

    loadTags();
  }, []);

  // select file to edit
  const handleSelectImage = (image: Image) => {
    setSelectedImage(image);
    setSelectedTags(image.tags.map(tag => tag.id));
  };

  // switch tag status
  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // save tags
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
        // update local state
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

  // 添加删除确认状态
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  // 添加删除图片方法
  const deleteImage = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/images/${selectedImage.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 从列表中移除已删除的图片
        setImages(prev => prev.filter(img => img.id !== selectedImage.id));

        // 清除选中状态
        setSelectedImage(null);
        setSelectedTags([]);

        // 显示成功提示
        setToast({
          show: true,
          message: '图片删除成功',
          type: 'success'
        });

        // 关闭确认对话框
        setDeleteConfirm(false);
      } else {
        // 显示错误提示
        setToast({
          show: true,
          message: '图片删除失败',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('删除图片失败:', error);
      setToast({
        show: true,
        message: '删除图片失败',
        type: 'error'
      });
    }
  };

  // 添加页面变更处理函数
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 添加上传对话框状态
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // 处理上传成功
  const handleUploadSuccess = () => {
    // 关闭上传对话框
    setShowUploadDialog(false);

    // 显示成功提示
    setToast({
      show: true,
      message: '图片上传成功',
      type: 'success'
    });

    // 重新加载图片列表
    setPage(1);
    loadImages();
  };

  // 处理上传错误
  const handleUploadError = (message: string) => {
    setToast({
      show: true,
      message,
      type: 'error'
    });
  };

  // 加载图片列表函数
  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/images?page=${page}&pageSize=20&tag=all`);
      if (response.ok) {
        const result = await response.json();
        setImages(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('fail to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加登出函数
  // 在现有代码中添加 signOut 导入
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[#2D1810]">Mehndi Design Admin</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        {/* Toast 组件 */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}

        {/* 添加删除确认对话框 */}
        {deleteConfirm && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm</h3>
              <p className="mb-6">Are you sure you want to delete image `{selectedImage.name}`? <br /><br />This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteImage}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 添加上传对话框 */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-semibold">上传新图片</h3>
                <button
                  onClick={() => setShowUploadDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ImageUploader
                tags={allTags}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
              />
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 添加上传按钮到标题旁边 */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#2D1810]">Image Tag Management</h1>
            <button
              onClick={() => setShowUploadDialog(true)}
              className="px-4 py-2 bg-[#7E4E3B] text-white rounded hover:bg-[#6D3D2A] flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Upload Image
            </button>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Image List */}
            <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Images</h2>

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
                        className={`flex items-center p-2 rounded cursor-pointer ${selectedImage?.id === image.id ? 'bg-[#FDF7F4] border border-[#7E4E3B]' : 'hover:bg-gray-100'
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

                  {/* 使用 Pagination 组件替代原有分页控件 */}
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

            {/* tag edit area */}
            <div className="md:col-span-3 bg-white p-4 rounded-lg shadow">
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

                      {/* 添加删除按钮 */}
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm mt-2"
                      >
                        Delete Image
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium mb-3">Edit Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {allTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag.id)
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
                    Save
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Please select an image to edit.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}