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
  const [chargerType, setChargerType] = useState<'AC' | 'DC'>('AC');

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
        <div className="bg-white py-16 relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-futuristic-grid bg-[length:30px_30px] opacity-5"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10 rounded-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-poppins animate-fade-in">
              <span className="bg-clip-text text-transparent bg-premium-gradient">Thunder Track</span> ROI Calculator
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-700 font-montserrat animate-fade-in" style={{animationDelay: '0.2s'}}>
              {chargerType === 'AC' 
                ? 'Calculate your savings from your AC charger' 
                : 'Calculate the return on investment and savings for installing our EV chargers'}
            </p>
            
            <div className="mt-10 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <Tabs 
                defaultValue="AC" 
                className="w-full max-w-md mx-auto"
                onValueChange={(value) => handleChargerTypeChange(value as 'AC' | 'DC')}
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-full ac-dc-toggle">
                  {/* Sliding background - must be below buttons for proper layering */}
                  <div className={`sliding-bg ${chargerType === 'DC' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                  <TabsTrigger 
                    value="AC" 
                    className="rounded-full transition-colors font-medium py-2 z-20"
                  >
                    AC Chargers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="DC" 
                    className="rounded-full transition-colors font-medium py-2 z-20"
                  >
                    DC Chargers
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <a 
              href="#calculator"
              className="inline-flex items-center mt-10 text-white bg-premium-gradient hover:opacity-90 px-6 py-3 rounded-full transition-all hover:scale-105 hover:shadow-lg group border border-green-600/30 hover:border-green-600/50 font-montserrat animate-fade-in"
              onClick={scrollToCalculator}
              style={{animationDelay: '0.4s'}}
            >
              Calculate Your Savings
            </a>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 bg-white relative z-10" id="calculator">
          <div className="max-w-4xl mx-auto">
            <div>
              <CalculatorForm 
                onCalculate={handleCalculate} 
                chargerType={chargerType}
                acChargers={acChargerTypes}
                dcChargers={dcChargerTypes}
              />
            </div>
            
            <div id="results">
              <ResultsTable 
                results={calculationResults} 
                charger={selectedCharger} 
                chargerCount={chargerCount}
                civilWorkCost={civilWorkCost}
              />
            </div>
            
            <InformationSection chargerType={chargerType} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
