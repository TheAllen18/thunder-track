
import React from 'react';

const EVLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        {/* Cross shape with gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-evgreen-light to-evgreen rounded-md rotate-45"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-evgreen to-evgreen-dark rounded-md -rotate-45"></div>
        {/* Arrow overlay */}
        <div className="absolute w-10 h-5 right-0 bottom-1 overflow-hidden">
          <div className="absolute w-10 h-10 bg-gradient-to-br from-evgold-light to-evgold-dark rounded-full transform -rotate-[30deg] translate-y-4"></div>
        </div>
      </div>
      <div className="font-bold text-xl text-evgreen">EV<span className="text-evgold">ROI</span></div>
    </div>
  );
};

export default EVLogo;
