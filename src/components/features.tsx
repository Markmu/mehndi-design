import { Grid3X3, History, BookOpen } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: <Grid3X3 className="w-6 h-6 text-[#7E4E3B]" />,
      title: "Curated Collections",
      description: "Explore diverse henna designs categorized for easy browsing"
    },
    {
      icon: <History className="w-6 h-6 text-[#7E4E3B]" />,
      title: "Latest Trends",
      description: "Stay updated with contemporary henna patterns and styles"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#7E4E3B]" />,
      title: "Design Guide",
      description: "Learn about Henna history, techniques and cultural significance"
    }
  ];
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#2D1810] mb-4">
            Discover Our Features
          </h2>
          <p className="text-lg text-[#7E4E3B] max-w-2xl mx-auto">
            Everything you need to explore and learn about the art of Henna
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#FDF7F4] rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2D1810]">
                {feature.title}
              </h3>
              <p className="text-[#7E4E3B]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;