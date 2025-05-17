
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { ArrowDown } from 'lucide-react';

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<ChargerType | null>(null);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);

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
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-black to-zinc-900 py-16 relative overflow-hidden">
          {/* Futuristic grid pattern background */}
          <div className="absolute inset-0 bg-futuristic-grid bg-[length:30px_30px] opacity-20"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-poppins">
              <span className="bg-clip-text text-transparent bg-premium-gradient">Thunder Plus</span> EV ROI Calculator
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90 font-montserrat">
              Calculate the return on investment and savings for installing our AC EV chargers
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center mt-8 max-w-3xl mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800/40 backdrop-blur-sm p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3 border border-thunder/30 hover:border-thunder/60 transition-all floating">
                  <span className="text-2xl font-bold font-poppins">3.3</span>
                </div>
                <p className="font-montserrat">3.3 kW Single Phase</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800/40 backdrop-blur-sm p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3 border border-thunder/30 hover:border-thunder/60 transition-all floating">
                  <span className="text-2xl font-bold font-poppins">7.4</span>
                </div>
                <p className="font-montserrat">7.4 kW Single Phase</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800/40 backdrop-blur-sm p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3 border border-thunder/30 hover:border-thunder/60 transition-all floating">
                  <span className="text-2xl font-bold font-poppins">22</span>
                </div>
                <p className="font-montserrat">22 kW Three Phase</p>
              </div>
            </div>
            
            <a 
              href="#calculator"
              className="inline-flex items-center mt-10 text-white bg-zinc-800/30 hover:bg-zinc-700/40 backdrop-blur-sm px-5 py-3 rounded-full transition-all hover:scale-105 group border border-zinc-700/30 hover:border-thunder/30 font-montserrat"
              onClick={scrollToCalculator}
            >
              Calculate Your Savings
              <ArrowDown className="ml-2 h-5 w-5 animate-scroll-down" />
            </a>
          </div>
          
          {/* Decorative lights */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-thunder/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-accent2/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 bg-black relative z-10" id="calculator">
          <div className="max-w-4xl mx-auto">
            <CalculatorForm onCalculate={handleCalculate} />
            
            <div id="results">
              <ResultsTable 
                results={calculationResults} 
                charger={selectedCharger} 
                chargerCount={chargerCount}
                civilWorkCost={civilWorkCost}
              />
            </div>
            
            <InformationSection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
