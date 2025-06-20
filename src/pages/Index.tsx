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
  const [chargerType, setChargerType] = useState<'AC' | 'DC'>('DC'); // Default to DC since AC is hidden

  // AC_CHARGERS_HIDDEN: Set this to true to show AC chargers again
  const AC_CHARGERS_HIDDEN = true;
  const handleCalculate = (input: CalculationInput) => {
    const results = calculateEnhancedROI(input);
    setCalculationResults(results);
    setSelectedCharger(input.charger);
    setChargerCount(input.chargerCount);
    setCivilWorkCost(input.civilWorkCost || 0);

    // Scroll to results
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
  return <div className="flex flex-col min-h-screen relative">
      {/* More visible translucent light green gradient background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50/60 via-emerald-50/45 to-green-100/55 pointer-events-none z-0"></div>
      
      {/* Main content with higher z-index to stay above background */}
      <div className="relative z-10 flex flex-col min-h-screen bg-white/25 text-gray-800">
        <Header />
        
        <main className="flex-1">
          {/* Full-Screen Hero Section */}
          <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-white/40 via-gray-50/30 to-green-50/25">
            {/* Subtle background patterns */}
            <div className="absolute inset-0 bg-futuristic-grid bg-[length:40px_40px] opacity-3"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>
            
            <div className="container mx-auto px-4 text-center relative z-10 pt-20 pb-32">
              {/* Main Hero Content */}
              <div className="max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight mb-8 text-gray-900 font-poppins animate-fade-in leading-tight tracking-tight">
                  <span className="bg-clip-text text-transparent bg-premium-gradient font-normal">Thunder Track</span>
                  <br />
                  <span className="text-5xl md:text-6xl lg:text-7xl text-gray-800 font-light">ROI Calculator</span>
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto text-gray-700 font-montserrat mb-12 animate-fade-in leading-relaxed font-light" style={{
                animationDelay: '0.2s'
              }}>
                  Calculate your return on investment by installing our DC EV chargers.
                </p>
                
                {/* CTA Button */}
                <div className="animate-fade-in" style={{
                animationDelay: '0.4s'
              }}>
                  <button onClick={scrollToCalculator} className="inline-flex items-center gap-3 text-white bg-premium-gradient hover:opacity-90 px-10 py-5 rounded-full text-lg font-medium transition-all hover:scale-105 hover:shadow-2xl group border border-green-600/30 hover:border-green-600/50 font-montserrat shadow-lg tracking-wide">
                    Calculate Your ROI
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Calculator Section */}
          <section className="bg-white/40 py-16 relative" id="calculator">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
                    Start Your ROI Calculation
                  </h2>
                  <p className="text-lg text-gray-700 font-montserrat max-w-2xl mx-auto">
                    Enter your details below to get a detailed analysis of your potential returns
                  </p>
                </div>
                
                <div className="bg-white/80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
                  <CalculatorForm onCalculate={handleCalculate} chargerType={AC_CHARGERS_HIDDEN ? 'DC' : chargerType} acChargers={acChargerTypes} dcChargers={dcChargerTypes} hideACChargers={AC_CHARGERS_HIDDEN} />
                </div>
              </div>
            </div>
          </section>
          
          {/* Results Section */}
          <section id="results" className="bg-gray-50/40 py-[35px]">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <ResultsTable results={calculationResults} charger={selectedCharger} chargerCount={chargerCount} civilWorkCost={civilWorkCost} />
              </div>
            </div>
          </section>
          
          {/* Information Section */}
          <section className="bg-white/40 my-0 py-[5px]">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <InformationSection chargerType={AC_CHARGERS_HIDDEN ? 'DC' : chargerType} />
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>;
};

export default Index;
