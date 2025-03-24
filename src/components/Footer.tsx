
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h4 className="text-xl font-medium mb-4">Sustain Plate</h4>
            <p className="text-gray-600 mb-4">
              Connecting surplus food with those who need it most through our intelligent matching platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-sustain-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-sustain-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-sustain-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/#features" className="text-gray-600 hover:text-sustain-600 transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/#howitworks" className="text-gray-600 hover:text-sustain-600 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/#impact" className="text-gray-600 hover:text-sustain-600 transition-colors">Impact</Link>
              </li>
              <li>
                <Link to="/#register" className="text-gray-600 hover:text-sustain-600 transition-colors">Register</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-sustain-600 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-sustain-600 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-sustain-500 mr-2 mt-1" />
                <span className="text-gray-600">123 Green Street, Sustainable City, SC 12345</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-sustain-500 mr-2" />
                <a href="mailto:info@sustainplate.com" className="text-gray-600 hover:text-sustain-600 transition-colors">
                  info@sustainplate.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-sustain-500 mr-2" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-sustain-600 transition-colors">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Newsletter</h4>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter to receive updates on our impact and opportunities.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sustain-500/50 flex-grow"
              />
              <button
                type="submit"
                className="bg-sustain-500 text-white px-4 py-2 rounded-r-md hover:bg-sustain-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Sustain Plate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
