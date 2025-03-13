const Footer = () => (
  <footer className="bg-[#2D1810] text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#E6B3A3]">Traditional</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Modern</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Arabic</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Bridal</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Learn</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#E6B3A3]">Basics</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Tutorials</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Tips</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">History</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">About</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#E6B3A3]">About Us</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Contact</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#E6B3A3]">Terms</a></li>
          </ul>
        </div>
        
        <div>
          <div className="font-semibold mb-4">Henna Designs</div>
          <p className="text-sm text-gray-400">Your ultimate destination for discovering beautiful henna patterns and designs.</p>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
        © 2025 henna Designs. All rights reserved.
      </div>
    </div>
  </footer>
)

export default Footer;