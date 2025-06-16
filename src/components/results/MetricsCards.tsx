
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
            ₹{results.monthlyRevenue.toLocaleString()}
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
            ₹{results.annualRevenue.toLocaleString()}
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
            ₹{results.tenYearRevenue.toLocaleString()}
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
            {results.roiPercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
