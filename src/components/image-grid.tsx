import ImageCard from './image-card';

type ImageGridProps = {
  images: {
    id: number;
    name: string;
    objectUrl: string;
    tags: {
      id: number;
      name: string;
    }[];
  }[];
  loading?: boolean;
};

const ImageGrid = ({ images, loading = false }: ImageGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="aspect-square"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="flex gap-1">
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                  <div className="h-3 bg-gray-300 rounded w-10"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">没有找到符合条件的图片</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;