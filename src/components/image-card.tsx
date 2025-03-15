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
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <img
          src={image.objectUrl}
          alt={image.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        {/* 移除文件名显示 */}
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