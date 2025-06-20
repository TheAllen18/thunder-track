
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DataParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  value: string;
  opacity: number;
}

const HolographicDataProjector = ({ calculationResults }: { calculationResults: any }) => {
  const [particles, setParticles] = useState<DataParticle[]>([]);
  const [isProjecting, setIsProjecting] = useState(false);

  const dataPoints = calculationResults ? [
    `ROI: ${calculationResults.roi}%`,
    `Payback: ${calculationResults.paybackPeriod} months`,
    `Revenue: $${calculationResults.monthlyRevenue?.toLocaleString()}`,
    `Profit: $${calculationResults.netProfit?.toLocaleString()}`,
    `Break-even: Month ${Math.ceil(calculationResults.paybackPeriod)}`,
    `Daily Sessions: ${Math.round((calculationResults.monthlyRevenue || 0) / 30 / 15)}`,
  ] : [
    'Waiting for data...',
    'Ready to project',
    'Thunder Track ROI',
    'Calculate to see magic',
  ];

  useEffect(() => {
    if (calculationResults) {
      setIsProjecting(true);
      generateParticles();
      const interval = setInterval(updateParticles, 50);
      return () => clearInterval(interval);
    }
  }, [calculationResults]);

  const generateParticles = () => {
    const newParticles: DataParticle[] = [];
    
    dataPoints.forEach((value, index) => {
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: index * 3 + i,
          x: Math.random() * 400,
          y: Math.random() * 300,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 20 + 10,
          color: `hsl(${120 + index * 30}, 70%, 60%)`,
          value: value,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
    });
    
    setParticles(newParticles);
  };

  const updateParticles = () => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: (particle.x + particle.vx + 400) % 400,
      y: (particle.y + particle.vy + 300) % 300,
      opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.7,
    })));
  };

  return (
    <Card className="w-full bg-black/90 border-2 border-cyan-400 shadow-2xl overflow-hidden">
      <CardContent className="p-0 relative h-80">
        {/* Holographic grid background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00ffff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Scanning lines effect */}
        <div className="absolute inset-0">
          <div className="scanning-line"></div>
          <div className="scanning-line" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Floating data particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute pointer-events-none transition-all duration-100 ease-linear"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                transform: `scale(${particle.size / 20})`,
                opacity: particle.opacity,
              }}
            >
              <div
                className="px-2 py-1 rounded text-xs font-mono whitespace-nowrap border shadow-lg"
                style={{
                  backgroundColor: `${particle.color}20`,
                  borderColor: particle.color,
                  color: particle.color,
                  textShadow: `0 0 10px ${particle.color}`,
                  boxShadow: `0 0 15px ${particle.color}40`,
                }}
              >
                {particle.value}
              </div>
            </div>
          ))}
        </div>

        {/* Center hologram effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-cyan-400 text-2xl font-bold mb-2 animate-pulse">
              {isProjecting ? '🌟 DATA PROJECTION ACTIVE 🌟' : '⚡ READY TO PROJECT ⚡'}
            </div>
            <div className="text-green-400 text-sm font-mono">
              {calculationResults ? 'Holographic ROI Analysis' : 'Awaiting calculation data...'}
            </div>
          </div>
        </div>

        {/* Corner indicators */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>
      </CardContent>

      <style jsx>{`
        .scanning-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          animation: scan 3s linear infinite;
        }
        
        @keyframes scan {
          0% { transform: translateY(-2px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(320px); opacity: 0; }
        }
      `}</style>
    </Card>
  );
};

export default HolographicDataProjector;
