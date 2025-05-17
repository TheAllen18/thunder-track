
import React from 'react';

const ThunderCalcLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12 pulse-glow">
        {/* Use the uploaded image */}
        <img 
          src="/lovable-uploads/dfc0363a-7144-45ad-a3e3-0c82713cb4de.png" 
          alt="ThunderTrack Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="font-bold text-xl text-white font-barlow">Thunder<span className="text-thunder">Track</span></div>
    </div>
  );
};

export default ThunderCalcLogo;
