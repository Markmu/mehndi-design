import TagButton from './tag-button';

type TagListProps = {
  tags: {
    id: number;
    name: string;
    slug: string;
    count?: number;
  }[];
  selectedTag?: string;
};

const TagList = ({ tags, selectedTag }: TagListProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <TagButton
          slug="all"
          name="All"
          isSelected={!selectedTag || selectedTag === 'all'}
        />
        {tags.map((tag) => (
          <TagButton
            key={tag.id}
            slug={tag.slug}
            name={tag.name}
            isSelected={selectedTag === tag.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default TagList;