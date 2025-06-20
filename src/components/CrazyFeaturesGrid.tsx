
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuantumFinancialPredictor from './QuantumFinancialPredictor';
import NeuralEVBrain from './NeuralEVBrain';
import TimeTravelROICalculator from './TimeTravelROICalculator';
import { 
  Bitcoin, 
  Cloud, 
  Dna, 
  Rocket, 
  Eye, 
  Radio, 
  Glasses, 
  Atom,
  Zap,
  TrendingUp
} from 'lucide-react';

interface CrazyFeaturesGridProps {
  calculationResults: any;
}

const CrazyFeaturesGrid = ({ calculationResults }: CrazyFeaturesGridProps) => {
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);

  const toggleFeature = (featureId: string) => {
    setActiveFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const mockFeatures = [
    {
      id: 'crypto',
      title: '₿ Crypto Mining Calculator',
      icon: <Bitcoin className="h-6 w-6" />,
      description: 'Mine Bitcoin while charging EVs!',
      value: calculationResults ? `${(calculationResults.monthlyRevenue * 0.15).toLocaleString()} BTC/month` : 'Calculate first'
    },
    {
      id: 'weather',
      title: '🌦️ Weather Impact Simulator', 
      icon: <Cloud className="h-6 w-6" />,
      description: 'Rain increases charging by 34%',
      value: calculationResults ? `${Math.round(Math.random() * 40 + 60)}% weather boost` : 'Awaiting data'
    },
    {
      id: 'social',
      title: '📱 Social Media Buzz Tracker',
      icon: <Radio className="h-6 w-6" />,
      description: 'Track EV sentiment in real-time',
      value: calculationResults ? `${Math.round(Math.random() * 100)}% positive buzz` : 'Monitoring...'
    },
    {
      id: 'ar',
      title: '🥽 AR ROI Overlay',
      icon: <Glasses className="h-6 w-6" />,
      description: 'See ROI in augmented reality',
      value: calculationResults ? 'AR Mode Ready' : 'Calculate to activate'
    },
    {
      id: 'galactic',
      title: '🚀 Galactic Expansion',
      icon: <Rocket className="h-6 w-6" />,
      description: 'ROI for Mars charging stations',
      value: calculationResults ? `${(calculationResults.roi * 50).toFixed(0)}% Mars ROI` : 'Launch pending'
    },
    {
      id: 'dna',
      title: '🧬 DNA Site Optimizer',
      icon: <Dna className="h-6 w-6" />,
      description: 'Genetic algorithms for locations',
      value: calculationResults ? 'DNA Analysis Complete' : 'Sequencing...'
    },
    {
      id: 'teleport',
      title: '⚡ Teleportation Comparison',
      icon: <Zap className="h-6 w-6" />,
      description: 'EV vs future teleportation costs',
      value: calculationResults ? 'EV wins by 99.9%' : 'Calculating...'
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">🎮 Main Features</TabsTrigger>
          <TabsTrigger value="quantum">🌌 Quantum</TabsTrigger>
          <TabsTrigger value="neural">🧠 Neural</TabsTrigger>
          <TabsTrigger value="time">⏰ Time Travel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  activeFeatures.includes(feature.id) 
                    ? 'bg-gradient-to-br from-green-100 to-blue-100 border-green-500' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100'
                }`}
                onClick={() => toggleFeature(feature.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-2">{feature.description}</p>
                  <div className="text-sm font-bold text-blue-600">{feature.value}</div>
                  {activeFeatures.includes(feature.id) && (
                    <div className="mt-2 p-2 bg-green-200 rounded text-xs animate-fade-in">
                      ✅ Feature Activated!
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quantum">
          <QuantumFinancialPredictor calculationResults={calculationResults} />
        </TabsContent>

        <TabsContent value="neural">
          <NeuralEVBrain calculationResults={calculationResults} />
        </TabsContent>

        <TabsContent value="time">
          <TimeTravelROICalculator calculationResults={calculationResults} />
        </TabsContent>
      </Tabs>

      {activeFeatures.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold mb-2">
                🎉 {activeFeatures.length} INSANE FEATURES ACTIVATED! 🎉
              </div>
              <div className="text-sm">
                Your ROI calculator just became the most advanced in the universe!
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrazyFeaturesGrid;
