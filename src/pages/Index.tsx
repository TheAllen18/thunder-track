
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, acChargerTypes, dcChargerTypes, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { ArrowDown } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-white text-zinc-800">
      <Header />
      
      <main className="flex-1">
        <div className="bg-white py-16 relative overflow-hidden">
          {/* Futuristic grid pattern background */}
          <div className="absolute inset-0 bg-futuristic-grid bg-[length:30px_30px] opacity-20"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900 font-poppins">
              <span className="bg-clip-text text-transparent bg-premium-gradient">Thunder Plus</span> ROI Calculator
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-zinc-700 font-montserrat">
              Calculate the return on investment and savings for installing our EV chargers
            </p>
            
            <div className="mt-10">
              <Tabs 
                defaultValue="AC" 
                className="w-full max-w-md mx-auto"
                onValueChange={(value) => handleChargerTypeChange(value as 'AC' | 'DC')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="AC">AC Chargers</TabsTrigger>
                  <TabsTrigger value="DC">DC Chargers</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <a 
              href="#calculator"
              className="inline-flex items-center mt-10 text-white bg-premium-gradient hover:bg-zinc-700/40 backdrop-blur-sm px-5 py-3 rounded-full transition-all hover:scale-105 group border border-green-600/30 hover:border-thunder/30 font-montserrat"
              onClick={scrollToCalculator}
            >
              Calculate Your Savings
            </a>
          </div>
          
          {/* Decorative lights */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-thunder/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-accent2/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 bg-white relative z-10" id="calculator">
          <div className="max-w-4xl mx-auto">
            <CalculatorForm 
              onCalculate={handleCalculate} 
              chargerType={chargerType}
              acChargers={acChargerTypes}
              dcChargers={dcChargerTypes}
            />
            
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
