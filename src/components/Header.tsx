
import React, { useState } from 'react';
import ThunderCalcLogo from './EVLogo';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-black bg-opacity-80 backdrop-blur-lg shadow-md shadow-zinc-900/30 sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <ThunderCalcLogo />
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-zinc-800 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="#calculator" className="text-white hover:text-thunder font-medium transition-colors">
            Calculator
          </a>
          <a href="#about" className="text-white hover:text-thunder font-medium transition-colors">
            About
          </a>
          <a href="#contact" className="text-white hover:text-thunder font-medium transition-colors">
            Contact
          </a>
        </nav>
        
        <button className="hidden md:block bg-premium-gradient text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors">
          Get a Quote
        </button>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-zinc-900 bg-opacity-90 backdrop-blur-lg shadow-lg md:hidden">
            <nav className="flex flex-col py-2">
              <a 
                href="#calculator" 
                className="px-4 py-2 hover:bg-zinc-800 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calculator
              </a>
              <a 
                href="#about" 
                className="px-4 py-2 hover:bg-zinc-800 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="px-4 py-2 hover:bg-zinc-800 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="px-4 py-2">
                <button className="w-full bg-premium-gradient text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors">
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
