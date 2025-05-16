
import React from 'react';

const ThunderCalcLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12 pulse-glow">
        {/* Use the uploaded image */}
        <img 
          src="/lovable-uploads/395e316a-0428-42ed-9920-5cbfa451f918.png" 
          alt="ThunderCalc Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="font-bold text-xl text-white">Thunder<span className="text-thunder">Calc</span></div>
    </div>
  );
};

export default ThunderCalcLogo;
