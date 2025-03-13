
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Category = {
  name: string;
  slug: string;
  image: string;
  count: number;
};

const Hero = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        // 获取所有标签
        const tagsResponse = await fetch('/api/tags');
        if (!tagsResponse.ok) return;

        const tags = await tagsResponse.json();

        // 获取每个标签的示例图片和数量
        const categoriesWithImages = await Promise.all(
          tags.slice(0, 6).map(async (tag: { name: string; slug: string }) => {
            // 获取该标签下的一张图片
            const imagesResponse = await fetch(`/api/images?tag=${tag.slug}&page=1&pageSize=1`);
            if (!imagesResponse.ok) {
              return {
                name: tag.name,
                slug: tag.slug,
                image: '', // 默认占位图
                count: 0
              };
            }

            const imagesData = await imagesResponse.json();
            const image = imagesData.data[0]?.objectUrl || '/api/placeholder/400/400';
            const count = imagesData.pagination.total;

            return {
              name: tag.name,
              slug: tag.slug,
              image,
              count
            };
          })
        );

        setCategories(categoriesWithImages);
      } catch (error) {
        console.error('加载分类失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F4] to-[#E6B3A3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D1810] mb-6">
            Discover Beautiful Henna Designs
          </h1>
          <p className="text-lg md:text-xl text-[#7E4E3B]">
            Your Ultimate Collection of Traditional & Modern Henna Patterns
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {loading ? (
            // 加载状态显示骨架屏
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
            ))
          ) : (
            categories.map((category, index) => (
              <Link 
                key={index} 
                href={`/gallery?tag=${category.slug}`}
                className="relative group cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-md">
                  <img
                    src={category.image}
                    alt={`${category.name} Henna Designs`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-xl md:text-2xl font-semibold">{category.name}</h3>
                    <p className="text-sm md:text-base mt-2">{category.count}+ designs</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-[120%] h-24 bg-white rotate-1"></div>
    </div>
  );
};

export default Hero;