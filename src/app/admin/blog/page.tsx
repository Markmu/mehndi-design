'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/model/blog';
import Toast from '@/components/toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const response = await fetch('/api/blog', {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Fail to load blog posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('fail to load blog posts:', error);
        setToast({
          show: true,
          message: 'Fail to load blog posts, please check your network connection or try again later',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const deletePost = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？此操作无法撤销。')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('删除文章失败');
      }

      setPosts(prev => prev.filter(post => post.id !== id));

      setToast({
        show: true,
        message: '文章删除成功',
        type: 'success'
      });
    } catch (error) {
      console.error('删除文章失败:', error);
      setToast({
        show: true,
        message: '删除文章失败',
        type: 'error'
      });
    }
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2D1810]">Blog Management</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-[#7E4E3B] text-white rounded hover:bg-[#6D3D2A] flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Blog
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E4E3B]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded object-cover" 
                          src={post.coverImage} 
                          alt={post.title} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">{post.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell>{post.publishedAt}</TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/admin/blog/edit/${post.id}`} 
                      className="text-[#7E4E3B] hover:text-[#6D3D2A] mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}