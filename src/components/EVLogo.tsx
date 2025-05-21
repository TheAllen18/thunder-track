
import React from 'react';

const ThunderCalcLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-14 h-14 md:w-16 md:h-16">
        {/* Use the uploaded image */}
        <img 
          src="/lovable-uploads/f800110d-478c-4adc-bd8b-30087dc66b31.png" 
          alt="Thunder Plus Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ThunderCalcLogo;
