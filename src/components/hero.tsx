import Link from 'next/link';
import { getCategories } from '@/services/category';


const Hero = async () => {
  const categories = await getCategories();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FDF7F4] to-[#E6B3A3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D1810] mb-6">
            Discover Beautiful Henna Designs
          </h1>
          <p className="text-lg md:text-xl text-[#7E4E3B]">
            Your Ultimate Collection of Traditional & Modern Henna Patterns
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={`/gallery?tag=${category.slug}`}
              className="relative group cursor-pointer"
            >
              <div className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-md">
                <img
                  src={category.image}
                  alt={`${category.name} Henna Designs`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-xl md:text-2xl font-semibold">{category.name}</h3>
                  <p className="text-sm md:text-base mt-2">{category.count}+ designs</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;