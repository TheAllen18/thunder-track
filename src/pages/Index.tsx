
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, acChargerTypes, dcChargerTypes, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from 'lucide-react';

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
        resultsElement.scrollIntoView({ behavior: 'smooth' });
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
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      
      <main className="flex-1">
        {/* Full-Screen Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-green-50">
          {/* Subtle background patterns */}
          <div className="absolute inset-0 bg-futuristic-grid bg-[length:40px_40px] opacity-3"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10 pt-20 pb-32">
            {/* Main Hero Content */}
            <div className="max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-900 font-poppins animate-fade-in leading-tight">
                <span className="bg-clip-text text-transparent bg-premium-gradient">Thunder Track</span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl text-gray-800">ROI Calculator</span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto text-gray-600 font-montserrat mb-12 animate-fade-in leading-relaxed" style={{animationDelay: '0.2s'}}>
                Calculate your return on investment by installing our DC EV chargers.
              </p>
              
              {/* CTA Button */}
              <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                <button 
                  onClick={scrollToCalculator}
                  className="inline-flex items-center gap-3 text-white bg-premium-gradient hover:opacity-90 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-2xl group border border-green-600/30 hover:border-green-600/50 font-montserrat shadow-lg"
                >
                  Calculate Your ROI
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex flex-col items-center text-gray-400">
              <span className="text-sm font-medium mb-2 font-montserrat">Scroll to explore</span>
              <ChevronDown className="w-6 h-6 animate-scroll-down" />
            </div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section className="bg-white py-16 relative" id="calculator">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
                  Start Your ROI Calculation
                </h2>
                <p className="text-lg text-gray-600 font-montserrat max-w-2xl mx-auto">
                  Enter your details below to get a detailed analysis of your potential returns
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
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
        
        {/* Results Section */}
        <section className="bg-gray-50 py-12" id="results">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ResultsTable 
                results={calculationResults} 
                charger={selectedCharger} 
                chargerCount={chargerCount}
                civilWorkCost={civilWorkCost}
              />
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <InformationSection chargerType={AC_CHARGERS_HIDDEN ? 'DC' : chargerType} />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
