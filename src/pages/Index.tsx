import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import ParticleBackground from '@/components/ParticleBackground';
import MatrixRain from '@/components/MatrixRain';
import HolographicButton from '@/components/HolographicButton';
import { ChargerType, acChargerTypes, dcChargerTypes, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { toast } from 'sonner';
import { ChevronDown, Zap, TrendingUp, Cpu } from 'lucide-react';

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<ChargerType | null>(null);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);
  const [chargerType, setChargerType] = useState<'AC' | 'DC'>('DC');
  const [isCalculating, setIsCalculating] = useState(false);

  const AC_CHARGERS_HIDDEN = true;

  const handleCalculate = useCallback(async (input: CalculationInput) => {
    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const results = calculateEnhancedROI(input);
      if (!results) {
        throw new Error('Failed to calculate results');
      }
      setCalculationResults(results);
      setSelectedCharger(input.charger);
      setChargerCount(input.chargerCount);
      setCivilWorkCost(input.civilWorkCost || 0);

      toast.success('🚀 Calculation completed successfully!', {
        description: 'Your ROI analysis is ready to blow your mind!'
      });

      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('⚡ Calculation failed!', {
        description: 'Please check your inputs and try again.'
      });
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleChargerTypeChange = useCallback((type: 'AC' | 'DC') => {
    setChargerType(type);
    setCalculationResults(null);
  }, []);

  const scrollToCalculator = useCallback(() => {
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, []);

  const memoizedResultsTable = useMemo(() => 
    calculationResults ? (
      <ResultsTable 
        results={calculationResults} 
        charger={selectedCharger} 
        chargerCount={chargerCount} 
        civilWorkCost={civilWorkCost} 
      />
    ) : null, 
    [calculationResults, selectedCharger, chargerCount, civilWorkCost]
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <ParticleBackground />
      <MatrixRain />
      
      <div className="relative z-10">
        <Header />
        
        <main className="flex-1">
          {/* Epic Hero Section */}
          <section className="min-h-screen flex flex-col justify-center items-center relative cyber-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-900/50 to-purple-900/20"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="container mx-auto px-4 text-center relative z-10 pt-20 pb-32">
              <div className="max-w-6xl mx-auto">
                {/* Holographic Icons */}
                <div className="flex justify-center gap-8 mb-8 animate-fade-in">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center glow-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center glow-pulse" style={{ animationDelay: '0.5s' }}>
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center glow-pulse" style={{ animationDelay: '1s' }}>
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h1 className="hero-title mb-8 animate-fade-in leading-tight">
                  <span className="block">THUNDER</span>
                  <span className="block text-4xl md:text-6xl lg:text-7xl font-light">TRACK</span>
                  <span className="block text-3xl md:text-5xl lg:text-6xl font-light text-emerald-400">ROI MATRIX</span>
                </h1>
                
                <div className="relative">
                  <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto text-gray-300 mb-12 animate-fade-in font-light leading-relaxed" style={{ animationDelay: '0.4s' }}>
                    Experience the <span className="neon-text font-bold">future of investment calculations</span> with our quantum-powered DC EV charger ROI analyzer
                  </p>
                  
                  <div className="data-stream w-full max-w-2xl mx-auto h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-12"></div>
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <HolographicButton 
                    onClick={scrollToCalculator}
                    size="lg"
                    className="group"
                  >
                    <span className="flex items-center gap-3">
                      INITIATE ROI SCAN
                      <Zap className="w-6 h-6 group-hover:animate-pulse" />
                    </span>
                  </HolographicButton>
                </div>

                <div className="scroll-indicator">
                  <ChevronDown className="w-8 h-8" />
                </div>
              </div>
            </div>
          </section>
          
          {/* Enhanced Calculator Section */}
          <section className="bg-slate-900/50 py-16 relative" id="calculator">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold neon-text mb-6 font-orbitron">
                    QUANTUM CALCULATOR
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Enter the matrix of financial analysis with our advanced ROI computation engine
                  </p>
                </div>
                
                <div className="quantum-card neon-border">
                  <CalculatorForm 
                    onCalculate={handleCalculate} 
                    chargerType={AC_CHARGERS_HIDDEN ? 'DC' : chargerType} 
                    acChargers={acChargerTypes} 
                    dcChargers={dcChargerTypes} 
                    hideACChargers={AC_CHARGERS_HIDDEN} 
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Enhanced Results Section */}
          <section id="results" className="bg-slate-950 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {isCalculating && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="quantum-loader"></div>
                      <div className="pulse-ring"></div>
                      <div className="pulse-ring" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <span className="mt-6 text-xl text-emerald-400 font-orbitron">PROCESSING QUANTUM DATA...</span>
                  </div>
                )}
                {memoizedResultsTable}
              </div>
            </div>
          </section>
          
          {/* Enhanced Information Section */}
          <section className="bg-slate-900/30 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <InformationSection chargerType={AC_CHARGERS_HIDDEN ? 'DC' : chargerType} />
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
