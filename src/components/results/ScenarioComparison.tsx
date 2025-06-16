
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, ChargerType } from '@/utils/calculatorUtils';

interface ScenarioComparisonProps {
  results: CalculationResult;
  charger: ChargerType;
  chargerCount: number;
  civilWorkCost: number;
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({
  results,
  charger,
  chargerCount,
  civilWorkCost
}) => {
  // Calculate base annual value
  const isAC = charger.type === 'AC';
  const annualValue = isAC 
    ? (results.yearlySavings || (results.monthlySavings || 0) * 12)
    : (results.yearlyNetRevenue || (results.monthlyNetRevenue || 0) * 12);

  // Generate comparison scenarios
  const scenarios = [
    {
      name: 'Single Charger',
      chargers: 1,
      investment: charger.price + civilWorkCost,
      revenue: annualValue / chargerCount
    },
    {
      name: 'Current Setup',
      chargers: chargerCount,
      investment: charger.price * chargerCount + civilWorkCost,
      revenue: annualValue
    },
    {
      name: 'Double Setup',
      chargers: chargerCount * 2,
      investment: charger.price * chargerCount * 2 + civilWorkCost,
      revenue: annualValue * 2
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Scenario Comparison - Different Installations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Scenario</th>
                  <th className="text-left p-3">Chargers</th>
                  <th className="text-left p-3">Investment</th>
                  <th className="text-left p-3">Annual Revenue</th>
                  <th className="text-left p-3">ROI %</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => {
                  const roi = scenario.investment > 0 ? (scenario.revenue / scenario.investment) * 100 : 0;
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{scenario.name}</td>
                      <td className="p-3">{scenario.chargers}</td>
                      <td className="p-3">₹{scenario.investment.toLocaleString()}</td>
                      <td className="p-3">₹{scenario.revenue.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`font-bold ${roi > 15 ? 'text-green-600' : roi > 10 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {roi.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioComparison;
