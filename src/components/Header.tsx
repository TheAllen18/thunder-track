
import React, { useState } from 'react';
import ThunderCalcLogo from './EVLogo';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <a href="https://www.thunderplus.io/" target="_blank" rel="noopener noreferrer">
          <ThunderCalcLogo />
        </a>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} className="text-zinc-900" /> : <Menu size={24} className="text-zinc-900" />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="#calculator" className="text-zinc-800 hover:text-thunder font-montserrat font-medium transition-colors">
            Calculator
          </a>
          <a href="#about" className="text-zinc-800 hover:text-thunder font-montserrat font-medium transition-colors">
            About
          </a>
          <a href="https://www.thunderplus.io/contactus.php" target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-thunder font-montserrat font-medium transition-colors">
            Contact
          </a>
        </nav>
        
        <a 
          href="https://www.thunderplus.io/contactus.php" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden md:block bg-premium-gradient text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors font-montserrat"
        >
          Get a Quote
        </a>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <nav className="flex flex-col py-2">
              <a 
                href="#calculator" 
                className="px-4 py-2 hover:bg-gray-100 text-zinc-800 font-montserrat"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calculator
              </a>
              <a 
                href="#about" 
                className="px-4 py-2 hover:bg-gray-100 text-zinc-800 font-montserrat"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="https://www.thunderplus.io/contactus.php" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 hover:bg-gray-100 text-zinc-800 font-montserrat"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="px-4 py-2">
                <a 
                  href="https://www.thunderplus.io/contactus.php" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-premium-gradient text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors font-montserrat"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get a Quote
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
