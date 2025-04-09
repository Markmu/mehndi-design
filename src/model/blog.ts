export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
}