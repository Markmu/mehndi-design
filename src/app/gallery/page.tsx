import { getTags, getGalleryData } from '@/services/gallery';
import TagList from '@/components/tag-list';
import ImageGrid from '@/components/image-grid';
import Pagination from '@/components/pagination';

type PageProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function GalleryPage({ searchParams }: PageProps) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 12;
  const tagSlug = searchParams?.tag || 'all';

  const [tags, galleryData] = await Promise.all([
    getTags(),
    getGalleryData(page, pageSize, tagSlug)
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#2D1810] mb-8">Henna Gallery</h1>
          
          <TagList tags={tags} selectedTag={tagSlug} />
          <ImageGrid images={galleryData.images} loading={false} />
          
          {galleryData.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={galleryData.pagination.page}
                totalPages={galleryData.pagination.totalPages}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}