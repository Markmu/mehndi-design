'use client';

import { Tag } from '@/model/tag';
import ImageUploader from '@/components/image-uploader';

interface UploadDialogProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
  tags: Tag[];
}

export default function UploadDialog({ show, onClose, onSuccess, onError, tags }: UploadDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">上传新图片</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ImageUploader
          tags={tags}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </div>
  );
}