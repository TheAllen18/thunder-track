
import React from 'react';
import ThunderCalcLogo from './EVLogo';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-zinc-200 mt-16" id="contact">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <a href="https://www.thunderplus.io/" target="_blank" rel="noopener noreferrer">
              <ThunderCalcLogo />
            </a>
            <p className="text-zinc-700 text-sm font-montserrat">
              Providing innovative EV charging solutions for homes and businesses.
              Calculate your ROI and make informed decisions with Thunder Plus.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/thunderplushyd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-green-600 hover:text-white transition-colors text-zinc-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/thunderplus_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-green-600 hover:text-white transition-colors text-zinc-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/thunderplus/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-green-600 hover:text-white transition-colors text-zinc-800"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 w-4" />
              </a>
              <a 
                href="https://www.youtube.com/@Thunder_Plus" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-green-600 hover:text-white transition-colors text-zinc-800"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-xl text-zinc-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#calculator" className="text-zinc-700 hover:text-thunder font-montserrat transition-colors">Calculator</Link></li>
              <li><Link to="/#about" className="text-zinc-700 hover:text-thunder font-montserrat transition-colors">About</Link></li>
              <li><a href="https://www.thunderplus.io/contactus.php" target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-thunder font-montserrat transition-colors">Get a Quote</a></li>
              <li><a href="https://www.thunderplus.io/contactus.php" target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-thunder font-montserrat transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-xl text-zinc-900">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-zinc-700">
                <Mail size={18} className="text-thunder mt-1 flex-shrink-0" />
                <span className="font-montserrat text-sm">info@thunderplus.com</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-700">
                <Phone size={18} className="text-thunder mt-1 flex-shrink-0" />
                <span className="font-montserrat text-sm">+91 7337555238</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-700">
                <MapPin size={18} className="text-thunder mt-1 flex-shrink-0" />
                <span className="font-montserrat text-sm">#9-1-83 & 84, Amarchand Sharma Complex, Sarojini Devi Road, Secunderabad, Telangana, India. 500003</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-200 mt-8 pt-6 text-center text-sm text-zinc-600">
          <p className="font-montserrat">Copyright © 2025 ThunderPlus and/or its affiliates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
