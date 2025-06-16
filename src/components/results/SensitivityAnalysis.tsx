
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, ChargerType } from '@/utils/calculatorUtils';

interface SensitivityAnalysisProps {
  results: CalculationResult;
  charger: ChargerType;
  chargerCount: number;
  civilWorkCost: number;
}

const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({
  results,
  charger,
  chargerCount,
  civilWorkCost
}) => {
  // Calculate base values
  const isAC = charger.type === 'AC';
  const annualValue = isAC 
    ? (results.yearlySavings || (results.monthlySavings || 0) * 12)
    : (results.yearlyNetRevenue || (results.monthlyNetRevenue || 0) * 12);
  
  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  const baseROI = totalInvestment > 0 ? (annualValue / totalInvestment) * 100 : 0;

  // Calculate sensitivity scenarios
  const scenarios = [
    { name: 'Optimistic (+20% usage)', multiplier: 1.2, color: 'text-green-600' },
    { name: 'Current Projection', multiplier: 1.0, color: 'text-blue-600' },
    { name: 'Conservative (-20% usage)', multiplier: 0.8, color: 'text-orange-600' },
    { name: 'Pessimistic (-40% usage)', multiplier: 0.6, color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Sensitivity Analysis - Usage Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => {
              const adjustedRevenue = annualValue * scenario.multiplier;
              const adjustedROI = baseROI * scenario.multiplier;
              
              return (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{scenario.name}</p>
                    <p className="text-sm text-gray-600">Usage variation from baseline</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${scenario.color}`}>
                      ₹{adjustedRevenue.toLocaleString()}
                    </p>
                    <p className={`text-sm ${scenario.color}`}>
                      ROI: {adjustedROI.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensitivityAnalysis;
