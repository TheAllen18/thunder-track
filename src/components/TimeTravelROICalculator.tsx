
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Zap } from 'lucide-react';

const TimeTravelROICalculator = ({ calculationResults }: { calculationResults: any }) => {
  const [selectedEra, setSelectedEra] = useState('2024');
  const [isTimeTravel, setIsTimeTravel] = useState(false);

  const timeEras = [
    {
      era: '1885',
      name: 'Wild West Era',
      description: 'Horse & Buggy charging stations',
      roiMultiplier: 0.1,
      currency: 'Gold Nuggets',
      insight: '🐎 Horses were the main transportation. EV charging would be revolutionary!'
    },
    {
      era: '1955',
      name: 'Back to the Future',
      description: 'Great Scott! DeLorean charging',
      roiMultiplier: 2.5,
      currency: 'Dollars',
      insight: '⚡ 1.21 Gigawatts needed! Flux capacitor integration required.'
    },
    {
      era: '2024',
      name: 'Present Day',
      description: 'Current market conditions',
      roiMultiplier: 1.0,
      currency: 'USD',
      insight: '🚗 Perfect timing for EV revolution!'
    },
    {
      era: '2045',
      name: 'AI Singularity',
      description: 'Post-human civilization',
      roiMultiplier: 10.0,
      currency: 'Neural Credits',
      insight: '🤖 AIs need charging too! Unlimited demand from robot citizens.'
    },
    {
      era: '2150',
      name: 'Space Age',
      description: 'Intergalactic charging network',
      roiMultiplier: 100.0,
      currency: 'Quantum Coins',
      insight: '🚀 Charging stations on Mars, Jupiter, and beyond!'
    }
  ];

  const handleTimeTravel = (era: string) => {
    setIsTimeTravel(true);
    setSelectedEra(era);
    
    setTimeout(() => {
      setIsTimeTravel(false);
    }, 2000);
  };

  const currentEra = timeEras.find(e => e.era === selectedEra);
  const baseROI = calculationResults?.roi || 20;
  const timeTravelROI = baseROI * (currentEra?.roiMultiplier || 1);

  return (
    <Card className="bg-gradient-to-br from-amber-900 to-orange-900 text-white border-2 border-amber-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6 animate-spin" />
          ⏰ Time Travel ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isTimeTravel && (
            <div className="text-center p-4 bg-blue-600/50 rounded animate-pulse">
              <div className="text-2xl">🌀 TIME TRAVELING... 🌀</div>
              <div className="text-sm">Adjusting for temporal market conditions...</div>
            </div>
          )}

          {/* Era Selection */}
          <div className="grid grid-cols-2 gap-2">
            {timeEras.map((era) => (
              <Button
                key={era.era}
                onClick={() => handleTimeTravel(era.era)}
                variant={selectedEra === era.era ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {era.era}
              </Button>
            ))}
          </div>

          {/* Current Era Display */}
          {currentEra && (
            <div className="bg-black/30 p-4 rounded border border-amber-300">
              <div className="text-center mb-3">
                <div className="text-xl font-bold">{currentEra.name}</div>
                <div className="text-sm text-amber-300">{currentEra.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {timeTravelROI.toFixed(1)}%
                  </div>
                  <div className="text-xs">ROI in {currentEra.era}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">
                    {currentEra.currency}
                  </div>
                  <div className="text-xs">Currency</div>
                </div>
              </div>

              <div className="mt-3 p-2 bg-amber-600/30 rounded text-xs">
                {currentEra.insight}
              </div>
            </div>
          )}

          <div className="text-xs text-amber-200">
            ⚠️ Time travel calculations are based on advanced temporal economics
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTravelROICalculator;
