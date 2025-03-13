'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type TagListProps = {
  tags: {
    id: number;
    name: string;
    slug: string;
    count: number;
  }[];
  selectedTag?: string;
};

const TagList = ({ tags, selectedTag }: TagListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleTagClick = (slug: string) => {
    router.push(`/gallery?${createQueryString('tag', slug)}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-[#2D1810]">标签筛选</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => router.push('/gallery')}
          className={`px-4 py-2 rounded-full text-sm ${
            !selectedTag
              ? 'bg-[#7E4E3B] text-white'
              : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.slug)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedTag === tag.slug
                ? 'bg-[#7E4E3B] text-white'
                : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagList;