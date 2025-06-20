
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, acChargerTypes, dcChargerTypes, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<ChargerType | null>(null);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);
  const [chargerType, setChargerType] = useState<'AC' | 'DC'>('DC');

  const AC_CHARGERS_HIDDEN = true;

  const handleCalculate = (input: CalculationInput) => {
    const results = calculateEnhancedROI(input);
    setCalculationResults(results);
    setSelectedCharger(input.charger);
    setChargerCount(input.chargerCount);
    setCivilWorkCost(input.civilWorkCost || 0);

    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleChargerTypeChange = (type: 'AC' | 'DC') => {
    setChargerType(type);
    setCalculationResults(null);
  };

  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Enhanced Multi-layer Background System */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-green-100/60 to-teal-50/70"></div>
        
        {/* Secondary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/8 via-transparent to-emerald-500/12"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-green-400/15 to-transparent rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-emerald-500/20 to-transparent rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-2/3 left-3/4 w-64 h-64 bg-gradient-radial from-teal-400/12 to-transparent rounded-full blur-xl floating"></div>
        
        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 premium-grid-pattern opacity-30"></div>
        <div className="absolute inset-0 premium-dot-pattern opacity-20"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 noise-texture opacity-5"></div>
      </div>
      
      {/* Main content with enhanced glass morphism */}
      <div className="relative z-10 flex flex-col min-h-screen bg-white/30 backdrop-blur-[2px]">
        <Header />
        
        <main className="flex-1">
          {/* Revolutionary Hero Section */}
          <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
            {/* Dynamic floating elements */}
            <div className="absolute top-20 right-16 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/30 rounded-2xl rotate-45 animate-float blur-sm"></div>
            <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-tr from-teal-400/25 to-green-500/20 rounded-full animate-pulse-glow"></div>
            <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-gradient-to-br from-emerald-300/30 to-green-600/25 rounded-lg rotate-12 floating"></div>
            
            <div className="container mx-auto px-4 text-center relative z-10 pt-20 pb-32">
              <div className="max-w-6xl mx-auto">
                {/* Ultra-modern typography */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight mb-8 text-gray-900 font-poppins animate-fade-in leading-[0.85] tracking-[-0.02em]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 font-medium drop-shadow-sm">
                    Thunder Track
                  </span>
                  <br />
                  <span className="text-5xl md:text-6xl lg:text-7xl text-gray-800/90 font-extralight tracking-[-0.01em]">
                    ROI Calculator
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto text-gray-700/90 font-montserrat mb-16 animate-fade-in leading-[1.4] font-light tracking-wide" 
                   style={{ animationDelay: '0.2s' }}>
                  Calculate your return on investment with our advanced DC EV charging solutions.
                  <br />
                  <span className="text-lg md:text-xl text-gray-600/80 mt-2 block">
                    Powered by intelligent algorithms and real-world data
                  </span>
                </p>
                
                {/* Premium CTA with enhanced design */}
                <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <button 
                    onClick={scrollToCalculator} 
                    className="group relative inline-flex items-center gap-4 text-white bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 hover:from-green-700 hover:via-emerald-600 hover:to-green-700 px-12 py-6 rounded-2xl text-xl font-semibold transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-green-500/30 hover:border-green-400/50 font-montserrat shadow-xl tracking-wide backdrop-blur-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10">Calculate Your ROI</span>
                    <div className="relative z-10 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Enhanced Calculator Section */}
          <section className="relative py-20" id="calculator">
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-gray-50/40 to-white/50"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins mb-6 tracking-tight">
                    Start Your 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500"> ROI Journey</span>
                  </h2>
                  <p className="text-xl text-gray-700/90 font-montserrat max-w-3xl mx-auto leading-relaxed">
                    Enter your details below to get a comprehensive analysis of your potential returns with our intelligent calculation engine
                  </p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden ring-1 ring-gray-200/50">
                  <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 p-1">
                    <div className="bg-white/95 rounded-3xl">
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
              </div>
            </div>
          </section>
          
          {/* Premium Results Section */}
          <section id="results" className="relative py-16">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/60 to-white/70"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto">
                <ResultsTable 
                  results={calculationResults} 
                  charger={selectedCharger} 
                  chargerCount={chargerCount} 
                  civilWorkCost={civilWorkCost} 
                />
              </div>
            </div>
          </section>
          
          {/* Enhanced Information Section */}
          <section className="relative py-12">
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-gray-50/50"></div>
            <div className="container mx-auto px-4 relative z-10">
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
