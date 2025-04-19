'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function AIGeneratorPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('google', { callbackUrl: '/ai-generator' });
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E4E3B]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2D1810] mb-4">
            AI Henna Design Generator
          </h1>
          <p className="text-lg text-[#7E4E3B]">
            Create unique henna designs with the power of AI
          </p>
        </div>

        {/* 风格选择和生成界面将在这里实现 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-center text-gray-600">
            AI generation feature coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}