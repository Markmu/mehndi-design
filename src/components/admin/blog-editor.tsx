'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/model/blog';
import ImageUploader from '../image-uploader';
import moment from 'moment';

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
}

export default function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);

  // 自动生成slug
  useEffect(() => {
    if (!post && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      await onSave({
        id: post?.id,
        title,
        slug,
        content,
        excerpt,
        coverImage,
        tags: tagArray,
        publishedAt: post?.publishedAt || moment().format('YYYY-MM-DD HH:mm:ss'),
        author: post?.author || {
          name: '管理员', // 默认作者，实际应用中应该使用当前登录用户
        }
      });
    } catch (error) {
      console.error('保存文章失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 处理图片上传成功
  const handleImageUploadSuccess = (imageUrl: string) => {
    console.log('图片上传成功:', imageUrl);
    setCoverImage(imageUrl);
  };

  // 处理图片上传失败
  const handleImageUploadError = (message: string) => {
    console.error('图片上传失败:', message);
    // 这里可以添加错误提示UI
    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          标题
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B]"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B]"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          摘要
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          封面图片
        </label>
        <ImageUploader
          tags={[]} // 如果需要标签功能，这里传入可用的标签列表
          onSuccess={handleImageUploadSuccess}
          onError={handleImageUploadError}
        />
        {coverImage && (
          <div className="mt-2">
            <img
              src={coverImage}
              alt="cover image preview"
              className="h-40 w-auto object-cover rounded"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          标签 (用逗号分隔)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B]"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          内容 (支持HTML)
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B] font-mono"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          disabled={saving}
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#7E4E3B] text-white rounded hover:bg-[#6D3D2A] flex items-center"
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              保存中...
            </>
          ) : (
            '保存文章'
          )}
        </button>
      </div>
    </form>
  );
}