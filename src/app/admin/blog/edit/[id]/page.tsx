'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BlogEditor from '@/components/admin/blog-editor';
import { BlogPost } from '@/model/blog';
import Toast from '@/components/toast';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/${params.id}`);

        if (!response.ok) {
          throw new Error('文章加载失败');
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('加载博客文章失败:', error);
        setToast({
          show: true,
          message: '加载文章失败，请稍后重试',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.id]);

  const handleSave = async (updatedPost: Partial<BlogPost>) => {
    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('更新文章失败');
      }

      const data = await response.json();
      setPost(data);

      setToast({
        show: true,
        message: '文章更新成功',
        type: 'success'
      });

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1500);
    } catch (error) {
      console.error('更新文章失败:', error);
      setToast({
        show: true,
        message: '更新文章失败，请稍后重试',
        type: 'error'
      });
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <h1 className="text-3xl font-bold text-[#2D1810] mb-8">编辑文章</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E4E3B]"></div>
        </div>
      ) : post ? (
        <div className="bg-white rounded-lg shadow p-6">
          <BlogEditor
            post={post}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">文章不存在或已被删除</p>
          <button
            onClick={() => router.push('/admin/blog')}
            className="px-4 py-2 bg-[#7E4E3B] text-white rounded hover:bg-[#6D3D2A]"
          >
            返回博客管理
          </button>
        </div>
      )}
    </div>
  );
}