
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChargerType, CalculationResult, formatCurrency, formatNumber } from '@/utils/calculatorUtils';
import { 
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';

interface ResultsTableProps {
  results: CalculationResult | null;
  charger: ChargerType | null;
  chargerCount: number;
  civilWorkCost: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, charger, chargerCount, civilWorkCost }) => {
  if (!results || !charger) return null;

  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  const isAC = charger.type === 'AC';
  
  // Format large numbers with commas
  const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };
  
  // PDF export function
  const exportToPDF = () => {
    const element = document.getElementById('results-for-pdf');
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `${charger.name}_ROI_Calculation.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // Colors for the charts
  const colors = {
    revenue: '#22C55E',
    cost: '#EF4444',
    profit: '#8B5CF6',
    charging: '#22C55E',
    fuel: '#EF4444',
    publicCharging: '#3B82F6',
    savings: '#8B5CF6',
    breakEven: '#000000',
    positive: '#22C55E',
    negative: '#EF4444',
  };

  // Get the first usage level (for AC) or first value (for DC)
  const monthlyUsage = isAC ? results.monthlyUnitsConsumed || 0 : results.monthlyConsumption[0] || 0;
  const breakEvenMonths = isAC ? results.breakEvenMonths || 0 : results.roiMonths[0] || 0;
  const monthlyRevenue = isAC ? 0 : results.revenue[0] || 0;
  const monthlyCost = isAC ? 0 : (results.expenditure[0] + results.operationalCost[0] + results.miscellaneousCost[0]) || 0;
  const monthlyProfit = isAC ? 0 : results.netRevenue[0] || 0;

  // Check for public charging comparison
  const hasPublicChargingData = isAC && 
    results.publicChargingMonthlyCost !== undefined && 
    results.publicChargingMonthlyCost > 0;

  // Prepare chart data
  const prepareChartData = () => {
    if (isAC) {
      // Comparison chart data
      return results.comparisons?.months.map((month, index) => ({
        month,
        HomeCharging: results.comparisons?.chargingCosts?.[index] || 0,
        ...(hasPublicChargingData 
          ? { PublicCharging: results.comparisons?.publicChargingCosts?.[index] || 0 }
          : { Fuel: results.comparisons?.fuelCosts?.[index] || 0 }),
        Savings: results.comparisons?.savingsPerMonth?.[index] || 0,
        CumulativeSavings: results.comparisons?.cumulativeSavings[index] || 0,
      }));
    } else {
      // DC charger ROI data
      return results.comparisons?.months.map((month, index) => ({
        month,
        CumulativeProfit: results.comparisons?.cumulativeSavings[index] || 0,
        MonthlyProfit: results.comparisons?.profits?.[index] || 0,
      }));
    }
  };
  
  const chartData = prepareChartData() || [];

  // Prepare pie chart data for DC revenue vs cost
  const costBreakdownData = [
    { name: 'Revenue', value: monthlyRevenue },
    { name: 'Electricity', value: results.expenditure[0] || 0 },
    { name: 'Operational', value: results.operationalCost[0] || 0 },
    { name: 'Miscellaneous', value: results.miscellaneousCost[0] || 0 }
  ];

  return (
    <div className="mt-8" id="results-for-pdf">
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader className="bg-premium-gradient text-white flex flex-row justify-between items-center">
          <CardTitle className="font-poppins">
            {isAC ? 'Savings Calculation Results' : 'ROI Calculation Results'}
          </CardTitle>
          <Button 
            onClick={exportToPDF} 
            variant="outline" 
            className="bg-white/20 text-white hover:bg-white/30 border-white/30"
          >
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Charger & Investment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">Charger & Investment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Selected Charger</p>
                <p className="font-semibold text-gray-900">{charger.name}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Number of Chargers</p>
                <p className="font-semibold text-gray-900">{chargerCount}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Investment</p>
                <p className="font-semibold text-gray-900">{formatCurrency(totalInvestment)}</p>
              </div>
            </div>
          </div>

          {/* AC Charger Results */}
          {isAC && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">Energy & Charging Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Est. Daily Energy Needed</p>
                    <p className="font-semibold text-gray-900">{formatNumber(results.dailyEnergyRequirement || 0)} kWh</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Est. Time for Daily Charge</p>
                    <p className="font-semibold text-gray-900">{formatNumber(results.dailyChargeTime || 0)} hours</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Est. Time for Full Charge (0-100%)</p>
                    <p className="font-semibold text-gray-900">{formatNumber(results.fullChargeTime || 0)} hours</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">Monthly Cost Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Monthly Energy Consumption</p>
                    <p className="font-semibold text-gray-900">{formatNumber(monthlyUsage)} kWh</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-gray-600">Home Charging Cost</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(results.monthlyChargingCost || 0)}</p>
                  </div>
                  
                  {hasPublicChargingData ? (
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-600">Public Charging Cost</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(results.publicChargingMonthlyCost || 0)}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                      <p className="text-gray-600">Fuel Cost</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(results.monthlyFuelCost || 0)}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">Savings & ROI</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Monthly Savings</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(results.monthlySavings || 0)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Yearly Savings</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(results.yearlySavings || 0)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Break-even Time</p>
                    <p className="font-semibold text-gray-900">{breakEvenMonths === Infinity ? '∞' : `${formatNumber(breakEvenMonths)} months`}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Total Savings (over {results.comparisons?.months.length ? Math.ceil(results.comparisons.months.length / 12) : 0} years)</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(results.totalSavingsOverTime || 0)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Per KM Cost (EV)</p>
                    <p className="font-semibold text-gray-900">₹{formatNumber(results.costPerKm || 0, 2)}/km</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">ROI (Annualized)</p>
                    <p className="font-semibold text-gray-900">{formatNumber(results.annualizedROIPercentage || 0, 1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* DC Charger Results */}
          {!isAC && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">Monthly Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Monthly Energy Delivered</p>
                    <p className="font-semibold text-gray-900">{formatNumber(monthlyUsage)} kWh</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Monthly Revenue</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Monthly Cost</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(monthlyCost)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Monthly Net Profit</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(monthlyProfit)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Yearly Net Profit</p>
                    <p className="font-semibold text-gray-900">{formatCurrency((results.yearlyNetRevenue || 0))}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">Break-even Time</p>
                    <p className="font-semibold text-gray-900">{breakEvenMonths === Infinity ? '∞' : `${formatNumber(breakEvenMonths)} months`}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">Projected Yearly Profits</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white ev-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        {results.profitYears?.map((_, index) => (
                          <th key={index}>Year {index + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Profit</td>
                        {results.profitYears?.map((profit, index) => (
                          <td key={index}>{formatCurrency(profit)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>Cumulative</td>
                        {results.profitYears?.map((_, index) => {
                          const cumulativeProfit = results.profitYears?.slice(0, index + 1).reduce((sum, profit) => sum + profit, 0) || 0;
                          return (
                            <td key={index}>{formatCurrency(cumulativeProfit)}</td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Charts Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">
              {isAC ? 'Savings Projection' : 'Profit Projection'}
            </h3>
            
            <div className="h-80">
              <ChartContainer config={{
                profit: { label: 'Profit', color: colors.profit },
                revenue: { label: 'Revenue', color: colors.revenue },
                cost: { label: 'Cost', color: colors.cost },
                savings: { label: 'Savings', color: colors.savings },
              }}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => value.replace('Month ', '')}
                    interval={Math.floor(chartData.length / 6)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <ReferenceLine y={0} stroke={colors.breakEven} strokeWidth={1} />
                  
                  <Line
                    type="monotone"
                    name="CumulativeSavings"
                    dataKey="CumulativeSavings"
                    stroke={colors.profit}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            <h3 className="text-lg font-semibold mb-4 font-poppins text-gray-800">
              {isAC ? 'Cost Comparison' : 'Revenue vs. Cost Breakdown'}
            </h3>
            
            <div className="h-80">
              {isAC ? (
                <BarChart
                  data={chartData.filter((_, i) => i % 3 === 0)} // Only show every 3rd data point to avoid crowding
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.replace('Month ', '')}
                    interval={Math.floor(chartData.length / 12)}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                  />
                  <Tooltip formatter={(value) => [`₹${formatLargeNumber(Number(value))}`, undefined]} />
                  <Legend />
                  <Bar dataKey="HomeCharging" name="Home Charging" fill={colors.charging} />
                  {hasPublicChargingData ? (
                    <Bar dataKey="PublicCharging" name="Public Charging" fill={colors.publicCharging} />
                  ) : (
                    <Bar dataKey="Fuel" name="Fuel" fill={colors.fuel} />
                  )}
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1000}
                  >
                    {costBreakdownData.map((entry, index) => {
                      const colors = ['#22C55E', '#EF4444', '#FB923C', '#8B5CF6'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${formatLargeNumber(Number(value))}`, undefined]} />
                  <Legend />
                </PieChart>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTable;
