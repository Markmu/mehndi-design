import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import MobileMenu from './mobile-menu';
import ClientLoginButton from './client-login-button';

const Navigation = async () => {
  const session = await getServerSession(authOptions);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo 部分 */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#2D1810]">
              <img src="/pattern.svg" alt="Logo" className="w-10 h-10 mr-4 inline" />
              Henna Designs
            </Link>
          </div>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-base font-medium ${href === '/' && (typeof window !== 'undefined' && window.location.pathname === '/') ||
                    (typeof window !== 'undefined' && window.location.pathname.startsWith(href) && href !== '/')
                    ? 'text-[#7E4E3B]' : 'text-[#2D1810] hover:text-[#7E4E3B]'
                  }`}
              >
                {label}
              </Link>
            ))}

            {/* 用户登录状态 */}
            <ClientLoginButton session={session} />
          </div>

          {/* 移动端菜单 */}
          <MobileMenu links={links} />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;