import Link from 'next/link';
import { headers } from 'next/headers';
import MobileMenu from './mobile-menu';

const Navigation = async () => {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/gallery', label: 'Gallery' },
  ];

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
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium ${
                  pathname === href ? 'text-[#7E4E3B]' : 'text-[#2D1810] hover:text-[#7E4E3B]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* 移动端菜单 */}
          <MobileMenu links={links} />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;