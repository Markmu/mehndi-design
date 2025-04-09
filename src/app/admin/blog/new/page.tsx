'use client';

import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/admin/blog-editor';
import { BlogPost } from '@/model/blog';
import Toast from '@/components/toast';
import { useState } from 'react';

export default function NewBlogPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleSave = async (post: Partial<BlogPost>) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '创建文章失败');
      }

      const createdPost = await response.json();
      console.log('创建文章成功:', createdPost);

      setToast({
        show: true,
        message: '文章创建成功',
        type: 'success'
      });

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1500);
    } catch (error) {
      console.error('创建文章失败:', error);
      setToast({
        show: true,
        message: error instanceof Error ? error.message : '创建文章失败',
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <h1 className="text-3xl font-bold text-[#2D1810] mb-8">新建文章</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <BlogEditor
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}