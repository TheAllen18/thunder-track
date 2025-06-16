
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, ChargerType } from '@/utils/calculatorUtils';

interface EnvironmentalImpactProps {
  results: CalculationResult;
  charger: ChargerType;
  isAC: boolean;
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({
  results,
  charger,
  isAC
}) => {
  // Calculate environmental impact (simplified calculation)
  const annualCO2Reduction = (results.annualRevenue / 10) * 0.5; // Rough estimate
  const treesEquivalent = Math.round(annualCO2Reduction / 21); // 1 tree absorbs ~21kg CO2/year

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-lg font-semibold text-green-800">
          Environmental Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Annual CO₂ Reduction</p>
            <p className="text-xl font-bold text-green-600">
              {annualCO2Reduction.toFixed(1)} kg
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Trees Equivalent</p>
            <p className="text-xl font-bold text-blue-600">
              {treesEquivalent} trees
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentalImpact;
