'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import LoginDialog from './login-dialog';

type MobileMenuProps = {
  links: Array<{ href: string; label: string }>;
};

const MobileMenu = ({ links }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="md:hidden flex items-center h-full">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="inline-flex items-center justify-center p-2 rounded-md text-[#2D1810] hover:text-[#7E4E3B] hover:bg-gray-100"
      >
        <span className="sr-only">open</span>
        {!isMenuOpen ? (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      <div
        className={`md:hidden fixed left-0 right-0 transition-all duration-200 ease-in-out z-50 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ top: '64px' }}
      >
        <div className="px-2 pt-2 pb-3 shadow-lg border-t bg-white">
          <div className="space-y-1 px-3 max-w-7xl mx-auto">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === href
                    ? 'bg-[#FDF7F4] text-[#7E4E3B]'
                    : 'text-[#2D1810] hover:bg-[#FDF7F4] hover:text-[#7E4E3B]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            
            {/* 添加登录/登出按钮 */}
            {session ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="px-3 py-2 text-base font-medium text-[#2D1810]">
                  {session.user?.name}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#7E4E3B] hover:bg-[#FDF7F4]"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <LoginDialog
                  trigger={
                    <button 
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#2D1810] hover:bg-[#FDF7F4] hover:text-[#7E4E3B]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;