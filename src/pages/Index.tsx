
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, calculateROI, CalculationResult } from '@/utils/calculatorUtils';
import { ArrowDown } from 'lucide-react';

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<ChargerType | null>(null);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);

  const handleCalculate = (
    charger: ChargerType,
    chargerCount: number,
    revenuePerUnit: number,
    expenditurePerUnit: number,
    operationalCostPerUnit: number,
    miscellaneousCostPerUnit: number,
    daysPerMonth: number,
    civilWorkCost: number
  ) => {
    const results = calculateROI(
      charger,
      chargerCount,
      revenuePerUnit,
      expenditurePerUnit,
      operationalCostPerUnit,
      miscellaneousCostPerUnit,
      daysPerMonth,
      [1, 2, 3, 4, 5],
      civilWorkCost
    );

    setCalculationResults(results);
    setSelectedCharger(charger);
    setChargerCount(chargerCount);
    setCivilWorkCost(civilWorkCost);

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
              EV Charger ROI Calculator
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Calculate the return on investment for installing our AC EV chargers
            </p>
            
            <a 
              href="#calculator"
              className="inline-flex items-center mt-8 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-full transition-colors"
            >
              Get Started
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
