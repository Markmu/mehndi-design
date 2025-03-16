'use client';

import { useState } from 'react';

type Tag = {
  id: number;
  name: string;
  slug: string;
};

type ImageUploaderProps = {
  tags: Tag[];
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function ImageUploader({ tags, onSuccess, onError }: ImageUploaderProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadTags, setUploadTags] = useState<number[]>([]);

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 设置文件和预览
    setUploadFile(file);
    setUploadName(file.name.replace(/\.[^/.]+$/, "")); // 移除扩展名作为默认名称

    // 创建预览URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 切换上传标签
  const toggleUploadTag = (tagId: number) => {
    setUploadTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 取消上传
  const cancelUpload = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadName('');
    setUploadTags([]);
  };

  // 上传图片
  const uploadImage = async () => {
    if (!uploadFile || !uploadName.trim()) {
      onError('Please select a file and enter a name');
      return;
    }

    setUploadLoading(true);

    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('description', uploadName); // 使用 description 字段

      // 将标签数组转换为逗号分隔的字符串
      const tagNames = uploadTags.map(tagId => {
        const tag = tags.find(t => t.id === tagId);
        return tag ? tag.name : '';
      }).filter(Boolean).join(',');

      formData.append('tags', tagNames);

      // 发送上传请求到现有的 API 接口
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 重置上传状态
        setUploadFile(null);
        setUploadPreview(null);
        setUploadName('');
        setUploadTags([]);

        // 通知父组件上传成功
        onSuccess();
      } else {
        // 显示错误提示
        const errorData = await response.json();
        onError(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      onError('Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {uploadPreview ? (
            <div className="relative">
              <img
                src={uploadPreview}
                alt="Preview"
                className="w-full h-64 object-contain border rounded"
              />
              <button
                onClick={cancelUpload}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to select an image or drag and drop</p>
              <p className="mt-1 text-xs text-gray-500">Supports JPG, PNG, WEBP formats</p>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        <div>
          <div className="mb-4">
            <label htmlFor="image-name" className="block text-sm font-medium text-gray-700 mb-1">
              Image Name
            </label>
            <input
              type="text"
              id="image-name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7E4E3B] focus:border-[#7E4E3B]"
              placeholder="Enter image name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleUploadTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm ${uploadTags.includes(tag.id)
                      ? 'bg-[#7E4E3B] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={cancelUpload}
              className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              disabled={uploadLoading}
            >
              Cancel
            </button>
            <button
              onClick={uploadImage}
              disabled={!uploadFile || uploadLoading}
              className={`px-4 py-2 bg-[#7E4E3B] text-white rounded hover:bg-[#6D3D2A] disabled:bg-gray-300 disabled:text-gray-500 flex items-center`}
            >
              {uploadLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : 'Upload Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}