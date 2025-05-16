
import React from 'react';

const EVLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-evgreen rounded-md rotate-45"></div>
        <div className="absolute inset-0 bg-evgreen rounded-md -rotate-45"></div>
        <div className="absolute right-0 bottom-2 w-8 h-4 bg-evgold rounded-r-full transform rotate-[25deg]"></div>
      </div>
      <div className="font-bold text-xl text-evgreen">EV<span className="text-evgold">ROI</span></div>
    </div>
  );
};

export default EVLogo;
