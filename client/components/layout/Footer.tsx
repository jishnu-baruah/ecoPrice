// components/layout/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About EcoPrice</h3>
              <p className="text-gray-600">
                Helping you make sustainable shopping choices while saving money.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-600 hover:text-green-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/how-it-works" className="text-gray-600 hover:text-green-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 hover:text-green-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-green-600">
                  Twitter
                </a>
                <a href="#" className="text-gray-600 hover:text-green-600">
                  Instagram
                </a>
                <a href="#" className="text-gray-600 hover:text-green-600">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; 2024 EcoPrice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }