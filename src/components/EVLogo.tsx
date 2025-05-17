
import React from 'react';

const ThunderCalcLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12 pulse-glow">
        {/* Use the uploaded image */}
        <img 
          src="/lovable-uploads/498fde47-4ead-498a-82b1-11500fcda09e.png" 
          alt="Thunder Plus Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="font-bold text-xl text-white font-poppins">Thunder<span className="text-thunder">Plus</span></div>
    </div>
  );
};

export default ThunderCalcLogo;
