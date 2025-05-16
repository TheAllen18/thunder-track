
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
    setCivilWorkCost(input.civilWorkNeeded ? input.civilWorkCost : 0);

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="bg-ev-gradient text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              EV Charger ROI & Savings Calculator
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Calculate the return on investment and savings for installing our AC EV chargers
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center mt-8 max-w-3xl mx-auto text-center">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">3.3</span>
                </div>
                <p>3.3 kW Single Phase</p>
                <p className="text-sm opacity-80">₹15,000</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">7.4</span>
                </div>
                <p>7.4 kW Single Phase</p>
                <p className="text-sm opacity-80">₹45,000</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full w-20 h-20 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold">22</span>
                </div>
                <p>22 kW Three Phase</p>
                <p className="text-sm opacity-80">₹65,000</p>
              </div>
            </div>
            
            <a 
              href="#calculator"
              className="inline-flex items-center mt-10 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-full transition-colors"
            >
              Calculate Your Savings
              <ArrowDown className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12" id="calculator">
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
