'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type TagButtonProps = {
  slug: string;
  name: string;
  isSelected: boolean;
};

export default function TagButton({ slug, name, isSelected }: TagButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tag', slug);
    router.push(`/gallery?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full text-sm ${
        isSelected
          ? 'bg-[#7E4E3B] text-white'
          : 'bg-gray-100 text-[#2D1810] hover:bg-gray-200'
      }`}
    >
      {name}
    </button>
  );
}