
import React from 'react';
import ThunderCalcLogo from './EVLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-8 mt-12" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <ThunderCalcLogo />
            <p className="text-zinc-300 text-sm">
              Providing innovative EV charging solutions for homes and businesses.
              Calculate your ROI and make informed decisions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact Us</h3>
            <p className="text-zinc-300 text-sm">
              Email: info@thundercalc.com<br />
              Phone: +91 98765 43210<br />
              Address: 123 EV Street, Electric City, India
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#calculator" className="text-zinc-300 hover:text-thunder">Calculator</a></li>
              <li><a href="#about" className="text-zinc-300 hover:text-thunder">About</a></li>
              <li><a href="#contact" className="text-zinc-300 hover:text-thunder">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-8 pt-4 text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} ThunderCalc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
