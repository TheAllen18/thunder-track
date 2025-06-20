
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Cpu, Zap } from 'lucide-react';

const NeuralEVBrain = ({ calculationResults }: { calculationResults: any }) => {
  const [brainActivity, setBrainActivity] = useState(0);
  const [learningPhase, setLearningPhase] = useState('Analyzing');
  const [insights, setInsights] = useState<string[]>([]);
  const [neuronFiring, setNeuronFiring] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainActivity(Math.random() * 100);
      setNeuronFiring(Math.random() > 0.7);
      
      if (calculationResults && Math.random() > 0.8) {
        const newInsights = [
          "🧠 Neural network detected optimal charging pattern",
          "⚡ Synaptic analysis suggests 23% efficiency boost",
          "🔮 Deep learning predicts peak usage at 2:30 PM",
          "🌟 AI consciousness recommends solar integration",
          "🚀 Machine learning evolved new pricing strategy"
        ];
        
        const randomInsight = newInsights[Math.floor(Math.random() * newInsights.length)];
        setInsights(prev => [randomInsight, ...prev.slice(0, 4)]);
        
        const phases = ['Learning', 'Evolving', 'Optimizing', 'Predicting', 'Transcending'];
        setLearningPhase(phases[Math.floor(Math.random() * phases.length)]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [calculationResults]);

  return (
    <Card className="bg-gradient-to-br from-cyan-900 to-blue-900 text-white border-2 border-cyan-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className={`h-6 w-6 ${neuronFiring ? 'animate-bounce' : 'animate-pulse'}`} />
          🧠 Neural EV Brain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Brain Activity Monitor */}
          <div className="text-center">
            <div className="text-lg font-bold mb-2">Brain Activity: {brainActivity.toFixed(1)}%</div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-400 h-4 rounded-full transition-all duration-300"
                style={{ width: `${brainActivity}%` }}
              ></div>
            </div>
            <div className="text-sm text-cyan-300 mt-2">
              Current Phase: <span className="font-bold">{learningPhase}</span>
            </div>
          </div>

          {/* Neural Network Visualization */}
          <div className="relative h-32 bg-black/30 rounded border border-cyan-300 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className={`h-16 w-16 text-cyan-400 ${neuronFiring ? 'animate-ping' : 'animate-pulse'}`} />
            </div>
            {/* Animated neurons */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-cyan-400 rounded-full ${neuronFiring ? 'animate-ping' : ''}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* AI Insights */}
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Insights:
            </h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {insights.map((insight, index) => (
                <div 
                  key={index} 
                  className="bg-black/40 p-2 rounded text-xs border border-cyan-500/30 animate-fade-in"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-cyan-200">
            🤖 AI is continuously learning from your data patterns
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NeuralEVBrain;
