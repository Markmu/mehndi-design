import { Grid3X3, History, BookOpen } from 'lucide-react'


const Features = () => (
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#FDF7F4] rounded-lg">
            <Grid3X3 className="w-6 h-6 text-[#7E4E3B]" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#2D1810]">Curated Collections</h3>
          <p className="text-[#7E4E3B]">Explore diverse henna designs categorized for easy browsing</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#FDF7F4] rounded-lg">
            <History className="w-6 h-6 text-[#7E4E3B]" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#2D1810]">Latest Trends</h3>
          <p className="text-[#7E4E3B]">Stay updated with contemporary henna patterns and styles</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#FDF7F4] rounded-lg">
            <BookOpen className="w-6 h-6 text-[#7E4E3B]" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#2D1810]">Design Guide</h3>
          <p className="text-[#7E4E3B]">Learn about Henna history, techniques and cultural significance</p>
        </div>
      </div>
    </div>
  </div>
)

export default Features;