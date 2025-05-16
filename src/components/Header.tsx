
import React from 'react';
import EVLogo from './EVLogo';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <EVLogo />
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
        <button className="bg-evgreen text-white px-4 py-2 rounded-md hover:bg-evgreen-dark transition-colors">
          Get a Quote
        </button>
      </div>
    </header>
  );
};

export default Header;
