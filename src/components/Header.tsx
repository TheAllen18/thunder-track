
import React from 'react';
import { Link } from 'react-router-dom';
import ThunderCalcLogo from './EVLogo';

const Header: React.FC = () => {
  // Function to scroll to contact section
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white py-1">
      <div className="container mx-auto flex justify-between items-center px-6 h-16">
        <div className="flex items-center">
          <a 
            href="https://www.thunderplus.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <ThunderCalcLogo />
          </a>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="https://www.thunderplus.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-700 hover:text-thunder font-montserrat transition-colors font-medium text-sm"
          >
            Home
          </a>
          <Link to="/quote" className="text-zinc-700 hover:text-thunder font-montserrat transition-colors font-medium text-sm">Get Quote</Link>
          <a 
            href="#contact" 
            className="text-zinc-700 hover:text-thunder font-montserrat transition-colors font-medium text-sm"
            onClick={scrollToContact}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
