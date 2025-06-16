
import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalculatorForm from '@/components/CalculatorForm';
import ResultsTable from '@/components/ResultsTable';
import InformationSection from '@/components/InformationSection';
import { ChargerType, acChargerTypes, dcChargerTypes, calculateEnhancedROI, CalculationResult, CalculationInput } from '@/utils/calculatorUtils';
import { toast } from 'sonner';

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<ChargerType | null>(null);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);
  const [chargerType, setChargerType] = useState<'AC' | 'DC'>('DC');
  const [isCalculating, setIsCalculating] = useState(false);

  // AC_CHARGERS_HIDDEN: Set this to true to show AC chargers again
  const AC_CHARGERS_HIDDEN = true;

  // Optimized calculation handler with better error handling
  const handleCalculate = useCallback(async (input: CalculationInput) => {
    setIsCalculating(true);
    
    try {
      // Add small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = calculateEnhancedROI(input);
      
      if (!results) {
        throw new Error('Failed to calculate results');
      }
      
      setCalculationResults(results);
      setSelectedCharger(input.charger);
      setChargerCount(input.chargerCount);
      setCivilWorkCost(input.civilWorkCost || 0);

      // Show success message
      toast.success('Calculation completed successfully!');

      // Smooth scroll to results with better timing
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
      toast.error('Failed to calculate results. Please check your inputs and try again.');
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleChargerTypeChange = useCallback((type: 'AC' | 'DC') => {
    setChargerType(type);
    setCalculationResults(null);
  }, []);

  const scrollToCalculator = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const calculatorElement = document.getElementById('calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, []);

  // Memoize heavy components to prevent unnecessary re-renders
  const memoizedResultsTable = useMemo(() => (
    calculationResults ? (
      <ResultsTable 
        results={calculationResults} 
        charger={selectedCharger} 
        chargerCount={chargerCount} 
        civilWorkCost={civilWorkCost} 
      />
    ) : null
  ), [calculationResults, selectedCharger, chargerCount, civilWorkCost]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      
      <main className="flex-1">
        {/* Enhanced Hero Section with better mobile optimization */}
        <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-green-50">
          {/* Optimized background patterns */}
          <div className="absolute inset-0 bg-futuristic-grid bg-[length:40px_40px] opacity-3"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10 pt-20 pb-32">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-extralight mb-6 md:mb-8 text-gray-900 font-poppins animate-fade-in leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-premium-gradient font-normal">Thunder Track</span>
                <br />
                <span className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-800 font-light">ROI Calculator</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-4xl mx-auto text-gray-600 font-montserrat mb-8 md:mb-12 animate-fade-in leading-relaxed font-light" 
                 style={{ animationDelay: '0.2s' }}>
                Calculate your return on investment by installing our enhanced DC EV chargers with advanced analytics.
              </p>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <button 
                  onClick={scrollToCalculator} 
                  className="inline-flex items-center gap-3 text-white bg-premium-gradient hover:opacity-90 px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-medium transition-all hover:scale-105 hover:shadow-2xl group border border-green-600/30 hover:border-green-600/50 font-montserrat shadow-lg tracking-wide"
                >
                  Calculate Your Enhanced ROI
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Calculator Section */}
        <section className="bg-white py-12 md:py-16 relative" id="calculator">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 font-poppins mb-4">
                  Start Your Enhanced ROI Calculation
                </h2>
                <p className="text-base md:text-lg text-gray-600 font-montserrat max-w-2xl mx-auto">
                  Enter your details below to get a comprehensive analysis with sensitivity testing and scenario comparisons
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <CalculatorForm 
                  onCalculate={handleCalculate} 
                  chargerType={AC_CHARGERS_HIDDEN ? 'DC' : chargerType} 
                  acChargers={acChargerTypes} 
                  dcChargers={dcChargerTypes} 
                  hideACChargers={AC_CHARGERS_HIDDEN}
                  isLoading={isCalculating}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Results Section */}
        <section id="results" className="bg-gray-50 py-8 md:py-[35px]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {isCalculating && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <span className="ml-4 text-gray-600">Calculating your enhanced ROI...</span>
                </div>
              )}
              {memoizedResultsTable}
            </div>
          </div>
        </section>
        
        {/* Information Section */}
        <section className="bg-white my-0 py-[5px]">
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
