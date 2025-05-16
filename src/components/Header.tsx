
import React, { useState } from 'react';
import EVLogo from './EVLogo';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <EVLogo />
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="#calculator" className="text-evgreen-dark hover:text-evgreen font-medium transition-colors">
            Calculator
          </a>
          <a href="#about" className="text-evgreen-dark hover:text-evgreen font-medium transition-colors">
            About
          </a>
          <a href="#contact" className="text-evgreen-dark hover:text-evgreen font-medium transition-colors">
            Contact
          </a>
        </nav>
        
        <button className="hidden md:block bg-evgreen text-white px-4 py-2 rounded-md hover:bg-evgreen-dark transition-colors">
          Get a Quote
        </button>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md md:hidden">
            <nav className="flex flex-col py-2">
              <a 
                href="#calculator" 
                className="px-4 py-2 hover:bg-gray-100 text-evgreen-dark"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calculator
              </a>
              <a 
                href="#about" 
                className="px-4 py-2 hover:bg-gray-100 text-evgreen-dark"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="px-4 py-2 hover:bg-gray-100 text-evgreen-dark"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="px-4 py-2">
                <button className="w-full bg-evgreen text-white px-4 py-2 rounded-md hover:bg-evgreen-dark transition-colors">
                  Get a Quote
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
