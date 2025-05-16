
import React from 'react';
import EVLogo from './EVLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <EVLogo />
            <p className="text-gray-600 text-sm">
              Providing innovative EV charging solutions for homes and businesses.
              Calculate your ROI and make informed decisions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-evgreen-dark">Contact Us</h3>
            <p className="text-gray-600 text-sm">
              Email: info@evroicalculator.com<br />
              Phone: +91 98765 43210<br />
              Address: 123 EV Street, Electric City, India
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-evgreen-dark">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#calculator" className="text-gray-600 hover:text-evgreen">Calculator</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-evgreen">About</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-evgreen">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EV ROI Calculator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
