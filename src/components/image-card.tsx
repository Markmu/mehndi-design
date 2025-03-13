'use client';

import { useState, useEffect } from 'react';

type ImageCardProps = {
  image: {
    id: number;
    name: string;
    objectUrl: string;
    tags: {
      id: number;
      name: string;
    }[];
  };
};

const ImageCard = ({ image }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(image.objectUrl);

  // 使用 useEffect 确保图片 URL 更新时重置加载状态
  useEffect(() => {
    setImgSrc(image.objectUrl);
    setIsLoaded(false);
  }, [image.objectUrl]);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={imgSrc}
          alt={image.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            // 图片加载失败时使用占位图
            setImgSrc('/placeholder-image.jpg');
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[#2D1810] mb-2">{image.name}</h3>
        <div className="flex flex-wrap gap-1">
          {image.tags.map((tag) => (
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
  );
};

export default ImageCard;