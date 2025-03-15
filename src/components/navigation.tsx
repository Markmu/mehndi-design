'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo 部分 */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#2D1810]">
              Henna Designs
            </Link>
          </div>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-[#7E4E3B]' : 'text-[#2D1810] hover:text-[#7E4E3B]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={`text-sm font-medium ${
                isActive('/gallery') ? 'text-[#7E4E3B]' : 'text-[#2D1810] hover:text-[#7E4E3B]'
              }`}
            >
              Gallery
            </Link>
            {/* <Link
              href="/about"
              className={`text-sm font-medium ${
                isActive('/about') ? 'text-[#7E4E3B]' : 'text-[#2D1810] hover:text-[#7E4E3B]'
              }`}
            >
              About
            </Link> */}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#2D1810] hover:text-[#7E4E3B] hover:bg-gray-100"
            >
              <span className="sr-only">打开主菜单</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-[#FDF7F4] text-[#7E4E3B]' 
                  : 'text-[#2D1810] hover:bg-[#FDF7F4] hover:text-[#7E4E3B]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/gallery')
                  ? 'bg-[#FDF7F4] text-[#7E4E3B]'
                  : 'text-[#2D1810] hover:bg-[#FDF7F4] hover:text-[#7E4E3B]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            {/* <Link
              href="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about')
                  ? 'bg-[#FDF7F4] text-[#7E4E3B]'
                  : 'text-[#2D1810] hover:bg-[#FDF7F4] hover:text-[#7E4E3B]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;