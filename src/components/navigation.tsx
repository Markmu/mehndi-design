import Link from 'next/link';

const Navigation = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="font-bold text-xl text-[#2D1810]">Henna Designs</div>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-zinc-800 hover:text-[#7E4E3B]">Home</Link>
          <Link href="/gallery" className="text-zinc-800 hover:text-[#7E4E3B]">Gallery</Link>
          {/* <a href="#" className="text-zinc-800 hover:text-[#7E4E3B]">Learn</a> */}
          <Link href="#" className="text-zinc-800 hover:text-[#7E4E3B]">About</Link>
        </div>
      </div>
    </div>
  </nav>
)

export default Navigation;