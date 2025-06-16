
import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, acChargerTypes, dcChargerTypes, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

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

      toast.success('Calculation completed successfully!');

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
      toast.error('Calculation failed. Please check your inputs and try again.');
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center">
          <div className="container mx-auto px-4 text-center pt-20 pb-32">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
                EV CHARGER
                <br />
                <span className="text-emerald-600">ROI CALCULATOR</span>
              </h1>
              
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 mb-12 leading-relaxed">
                Calculate your return on investment for DC EV charger installations with precision and ease
              </p>
              
              <button 
                onClick={scrollToCalculator}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
              >
                Start Calculating
              </button>

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-emerald-600 animate-bounce">
                <ChevronDown className="w-8 h-8" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section className="bg-white/50 py-16" id="calculator">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  ROI Calculator
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Enter your parameters below to calculate the financial returns of your EV charging investment
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8">
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
        <section id="results" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {isCalculating && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <span className="mt-4 text-lg text-gray-600">Calculating results...</span>
                </div>
              )}
              {memoizedResultsTable}
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="bg-white/50 py-16">
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
