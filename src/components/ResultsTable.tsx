
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChargerType, CalculationResult } from '@/utils/calculatorUtils';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useCalculationCache } from '@/hooks/useCalculationCache';
import ErrorBoundary from '@/components/results/ErrorBoundary';
import LoadingSpinner from '@/components/results/LoadingSpinner';

// Lazy load heavy components for better performance
const MetricsCards = React.lazy(() => import('@/components/results/MetricsCards'));
const EnvironmentalImpact = React.lazy(() => import('@/components/results/EnvironmentalImpact'));
const ChartsSection = React.lazy(() => import('@/components/results/ChartsSection'));
const SensitivityAnalysis = React.lazy(() => import('@/components/results/SensitivityAnalysis'));
const ScenarioComparison = React.lazy(() => import('@/components/results/ScenarioComparison'));

interface ResultsTableProps {
  results: CalculationResult | null;
  charger: ChargerType | null;
  chargerCount: number;
  civilWorkCost: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  charger,
  chargerCount,
  civilWorkCost
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sensitivity' | 'scenarios'>('overview');
  
  // Use calculation cache for performance
  const cachedResults = useCalculationCache(results, charger, chargerCount, civilWorkCost);
  
  if (!cachedResults || !charger) return null;
  
  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  const isAC = charger.type === 'AC';

  // Enhanced PDF export function
  const exportToPDF = async () => {
    setIsLoading(true);
    const element = document.getElementById('results-for-pdf');
    if (!element) return;

    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${charger.name}_${isAC ? 'Savings' : 'ROI'}_Analysis_Enhanced.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="mt-8" id="results-for-pdf">
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-premium-gradient text-white flex flex-row justify-between items-center rounded-t-xl">
            <CardTitle className="font-poppins text-lg md:text-xl">
              {isAC ? 'Enhanced Savings Analysis' : 'Enhanced ROI Analysis'}
            </CardTitle>
            <Button
              onClick={exportToPDF}
              variant="outline"
              disabled={isLoading}
              className="bg-white/20 text-white hover:bg-white/30 border-white/30 transition-all text-sm md:text-base"
            >
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? 'Generating...' : 'Export PDF'}
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveTab('overview')}
                className="flex-1 min-w-[100px] text-sm"
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'sensitivity' ? 'default' : 'outline'}
                onClick={() => setActiveTab('sensitivity')}
                className="flex-1 min-w-[100px] text-sm"
              >
                Sensitivity
              </Button>
              <Button
                variant={activeTab === 'scenarios' ? 'default' : 'outline'}
                onClick={() => setActiveTab('scenarios')}
                className="flex-1 min-w-[100px] text-sm"
              >
                Scenarios
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6 md:space-y-8">
                <Suspense fallback={<LoadingSpinner />}>
                  <MetricsCards 
                    results={cachedResults} 
                    charger={charger} 
                    isAC={isAC}
                    totalInvestment={totalInvestment}
                  />
                </Suspense>

                <Suspense fallback={<LoadingSpinner />}>
                  <EnvironmentalImpact 
                    results={cachedResults} 
                    charger={charger} 
                    isAC={isAC} 
                  />
                </Suspense>

                <Suspense fallback={<LoadingSpinner />}>
                  <ChartsSection 
                    results={cachedResults} 
                    charger={charger} 
                    isAC={isAC} 
                  />
                </Suspense>

                {/* Investment Overview - Mobile Optimized */}
                <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <CardHeader className="bg-gray-50 pb-2">
                    <h3 className="text-lg font-semibold font-poppins text-gray-800">Investment Overview</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="text-gray-600 text-sm font-medium">Selected Charger</p>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">{charger.name}</p>
                        <p className="text-xs text-gray-500 font-semibold">{charger.power}kW {charger.type}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="text-gray-600 text-sm font-medium">Quantity & Investment</p>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">{chargerCount} unit{chargerCount > 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500 font-semibold">₹{totalInvestment.toLocaleString()} total</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors sm:col-span-2 lg:col-span-1">
                        <p className="text-gray-600 text-sm font-medium">Payback Period</p>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">
                          {cachedResults.breakEvenMonths === Infinity ? '∞' : `${(cachedResults.breakEvenMonths / 12).toFixed(1)} years`}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">to recover investment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'sensitivity' && (
              <Suspense fallback={<LoadingSpinner />}>
                <SensitivityAnalysis 
                  results={cachedResults} 
                  charger={charger} 
                  chargerCount={chargerCount}
                  civilWorkCost={civilWorkCost}
                />
              </Suspense>
            )}

            {activeTab === 'scenarios' && (
              <Suspense fallback={<LoadingSpinner />}>
                <ScenarioComparison 
                  results={cachedResults} 
                  charger={charger} 
                  chargerCount={chargerCount}
                  civilWorkCost={civilWorkCost}
                />
              </Suspense>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ResultsTable;
