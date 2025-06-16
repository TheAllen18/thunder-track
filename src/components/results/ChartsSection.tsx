
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CalculationResult, ChargerType } from '@/utils/calculatorUtils';

interface ChartsSectionProps {
  results: CalculationResult;
  charger: ChargerType;
  isAC: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  results,
  charger,
  isAC
}) => {
  // Calculate annual revenue/savings
  const annualValue = isAC 
    ? (results.yearlySavings || (results.monthlySavings || 0) * 12)
    : (results.yearlyNetRevenue || (results.monthlyNetRevenue || 0) * 12);

  // Generate data for revenue projection
  const revenueData = Array.from({ length: 10 }, (_, index) => ({
    year: index + 1,
    revenue: annualValue * (index + 1),
    cumulative: annualValue * (index + 1) * (index + 1) * 0.5
  }));

  // Calculate monthly revenue for first year
  const monthlyValue = isAC 
    ? (results.monthlySavings || 0)
    : (results.monthlyRevenue || results.monthlyNetRevenue || 0);

  // Generate monthly data for first year
  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: `Month ${index + 1}`,
    revenue: monthlyValue,
    expenses: monthlyValue * 0.2 // Estimated expenses
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            10-Year Revenue Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Monthly Revenue vs Expenses (Year 1)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#10b981" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
