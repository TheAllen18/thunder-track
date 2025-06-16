
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, ChargerType } from '@/utils/calculatorUtils';

interface MetricsCardsProps {
  results: CalculationResult;
  charger: ChargerType;
  isAC: boolean;
  totalInvestment: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  results,
  charger,
  isAC,
  totalInvestment
}) => {
  // Calculate the values we need
  const monthlyRevenue = isAC 
    ? results.monthlySavings || 0 
    : results.monthlyRevenue || results.monthlyNetRevenue || 0;
  
  const annualRevenue = isAC 
    ? (results.yearlySavings || results.monthlySavings ? (results.monthlySavings || 0) * 12 : 0)
    : (results.yearlyNetRevenue || results.monthlyNetRevenue ? (results.monthlyNetRevenue || 0) * 12 : 0);
  
  const tenYearRevenue = annualRevenue * 10;
  
  const roiPercentage = totalInvestment > 0 ? (annualRevenue / totalInvestment) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {isAC ? 'Monthly Savings' : 'Monthly Revenue'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            ₹{monthlyRevenue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Annual {isAC ? 'Savings' : 'Revenue'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            ₹{annualRevenue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            10-Year {isAC ? 'Savings' : 'Revenue'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            ₹{tenYearRevenue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Net ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">
            {roiPercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
