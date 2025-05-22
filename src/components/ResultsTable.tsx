
import React, { useState } from 'react';
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
  Legend,
  Area,
  AreaChart
} from 'recharts';
import html2pdf from 'html2pdf.js';
import { Download, TrendingUp, Clock, IndianRupee, ZoomIn, ArrowDownCircle } from 'lucide-react';

interface ResultsTableProps {
  results: CalculationResult | null;
  charger: ChargerType | null;
  chargerCount: number;
  civilWorkCost: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, charger, chargerCount, civilWorkCost }) => {
  const [zoomedChart, setZoomedChart] = useState<'profit' | 'cost' | null>(null);

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
    profit: '#10B981',
    charging: '#22C55E',
    fuel: '#EF4444',
    publicCharging: '#3B82F6',
    savings: '#10B981',
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
  
  // Calculate metrics for key cards
  const monthlySavings = isAC ? results.monthlySavings || 0 : results.netRevenue[0] || 0;
  const yearlySavings = isAC ? results.yearlySavings || 0 : (results.yearlyNetRevenue || 0);
  const breakEvenTimeDisplayValue = breakEvenMonths === Infinity ? '∞' : `${formatNumber(breakEvenMonths)} months`;

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
        Revenue: results.comparisons?.revenues?.[index] || 0,
        Cost: results.comparisons?.costs?.[index] || 0,
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
  
  const handleChartZoom = (chartType: 'profit' | 'cost') => {
    setZoomedChart(chartType === zoomedChart ? null : chartType);
  };

  return (
    <div className="mt-8" id="results-for-pdf">
      <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="bg-premium-gradient text-white flex flex-row justify-between items-center rounded-t-xl">
          <CardTitle className="font-poppins">
            {isAC ? 'Savings Calculation Results' : 'ROI Calculation Results'}
          </CardTitle>
          <Button 
            onClick={exportToPDF} 
            variant="outline" 
            className="bg-white/20 text-white hover:bg-white/30 border-white/30 transition-all"
          >
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Key Metrics Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md border-l-4 border-l-green-500 hover:shadow-lg transition-all group hover:translate-y-[-2px] duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Savings</p>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{formatCurrency(monthlySavings)}</h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                    <IndianRupee className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition-all group hover:translate-y-[-2px] duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Yearly Savings</p>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{formatCurrency(yearlySavings)}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-l-4 border-l-purple-500 hover:shadow-lg transition-all group hover:translate-y-[-2px] duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Break-even Time</p>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{breakEvenTimeDisplayValue}</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charger & Investment Details */}
          <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-gray-50 pb-2">
              <h3 className="text-lg font-semibold font-poppins text-gray-800">Charger & Investment Details</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="text-gray-600">Selected Charger</p>
                  <p className="font-semibold text-gray-900">{charger.name}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="text-gray-600">Number of Chargers</p>
                  <p className="font-semibold text-gray-900">{chargerCount}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="text-gray-600">Total Investment</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(totalInvestment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section - Now placed immediately after Charger & Investment Details */}
          <div className="grid grid-cols-1 gap-6">
            {/* Savings/Profit Projection Chart */}
            <Card className="shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="bg-gray-50 pb-2 flex flex-row justify-between items-center">
                <h3 className="text-lg font-semibold font-poppins text-gray-800">
                  {isAC ? 'Savings Projection' : 'Profit Projection'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleChartZoom('profit')} 
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className={`${zoomedChart === 'profit' ? 'h-[500px]' : 'h-80'}`}>
                  <ChartContainer config={{
                    profit: { label: 'Profit', color: colors.profit },
                    revenue: { label: 'Revenue', color: colors.revenue },
                    cost: { label: 'Cost', color: colors.cost },
                    savings: { label: 'Savings', color: colors.savings },
                  }}>
                    {isAC ? (
                      <AreaChart 
                        data={chartData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
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
                        
                        <Area
                          type="monotone"
                          name="CumulativeSavings"
                          dataKey="CumulativeSavings"
                          stroke={colors.savings}
                          strokeWidth={2}
                          fill="url(#colorSavings)"
                          activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: colors.savings }}
                          isAnimationActive={true}
                          animationDuration={1000}
                        />
                      </AreaChart>
                    ) : (
                      <AreaChart 
                        data={chartData} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorCumulativeProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
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
                        
                        <Area
                          type="monotone"
                          name="CumulativeProfit"
                          dataKey="CumulativeProfit"
                          stroke="#22C55E"
                          strokeWidth={2}
                          fill="url(#colorCumulativeProfit)"
                          activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: "#22C55E" }}
                          isAnimationActive={true}
                          animationDuration={1000}
                        />
                      </AreaChart>
                    )}
                  </ChartContainer>
                  
                  {zoomedChart === 'profit' && (
                    <div className="flex justify-center mt-4">
                      <button
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={() => setZoomedChart(null)}
                      >
                        <ArrowDownCircle className="h-4 w-4 mr-1" />
                        Minimize Chart
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cost Comparison / Revenue vs Cost Breakdown Chart */}
            <Card className="shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="bg-gray-50 pb-2 flex flex-row justify-between items-center">
                <h3 className="text-lg font-semibold font-poppins text-gray-800">
                  {isAC ? 'Cost Comparison' : 'Revenue vs. Cost Breakdown'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleChartZoom('cost')} 
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className={`${zoomedChart === 'cost' ? 'h-[500px]' : 'h-80'}`}>
                  {isAC ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Home Charging', value: results.monthlyChargingCost || 0 },
                            hasPublicChargingData 
                              ? { name: 'Public Charging', value: results.publicChargingMonthlyCost || 0 }
                              : { name: 'Fuel', value: results.monthlyFuelCost || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={zoomedChart === 'cost' ? 160 : 100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          animationDuration={1000}
                          animationBegin={200}
                          animationEasing="ease-out"
                        >
                          <Cell fill={colors.charging} />
                          <Cell fill={hasPublicChargingData ? colors.publicCharging : colors.fuel} />
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${formatLargeNumber(Number(value))}`, undefined]} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={zoomedChart === 'cost' ? 160 : 100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          animationDuration={1000}
                          animationBegin={200}
                          animationEasing="ease-out"
                        >
                          {costBreakdownData.map((entry, index) => {
                            const pieColors = ['#22C55E', '#EF4444', '#FB923C', '#8B5CF6'];
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={pieColors[index % pieColors.length]} 
                                stroke="#fff" 
                                strokeWidth={1}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${formatLargeNumber(Number(value))}`, undefined]} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  
                  {zoomedChart === 'cost' && (
                    <div className="flex justify-center mt-4">
                      <button
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                        onClick={() => setZoomedChart(null)}
                      >
                        <ArrowDownCircle className="h-4 w-4 mr-1" />
                        Minimize Chart
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AC Charger Results */}
          {isAC && (
            <div className="space-y-6">
              <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gray-50 pb-2">
                  <h3 className="text-lg font-semibold font-poppins text-gray-800">Energy & Charging Details</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Est. Daily Energy Needed</p>
                      <p className="font-semibold text-gray-900">{formatNumber(results.dailyEnergyRequirement || 0)} kWh</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Est. Time for Daily Charge</p>
                      <p className="font-semibold text-gray-900">{formatNumber(results.dailyChargeTime || 0)} hours</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Est. Time for Full Charge (0-100%)</p>
                      <p className="font-semibold text-gray-900">{formatNumber(results.fullChargeTime || 0)} hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gray-50 pb-2">
                  <h3 className="text-lg font-semibold font-poppins text-gray-800">Monthly Cost Comparison</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Monthly Energy Consumption</p>
                      <p className="font-semibold text-gray-900">{formatNumber(monthlyUsage)} kWh</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Home Charging Cost</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(results.monthlyChargingCost || 0)}</p>
                    </div>
                    
                    {hasPublicChargingData ? (
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
                        <p className="text-gray-600">Public Charging Cost</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(results.publicChargingMonthlyCost || 0)}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500 hover:bg-gray-100 transition-colors">
                        <p className="text-gray-600">Fuel Cost</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(results.monthlyFuelCost || 0)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gray-50 pb-2">
                  <h3 className="text-lg font-semibold font-poppins text-gray-800">Additional Metrics</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Total Savings (over {results.comparisons?.months.length ? Math.ceil(results.comparisons.months.length / 12) : 0} years)</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(results.totalSavingsOverTime || 0)}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Per KM Cost (EV)</p>
                      <p className="font-semibold text-gray-900">₹{formatNumber(results.costPerKm || 0, 2)}/km</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">ROI (Annualized)</p>
                      <p className="font-semibold text-gray-900">{formatNumber(results.annualizedROIPercentage || 0, 1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* DC Charger Results */}
          {!isAC && (
            <div className="space-y-6">
              <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gray-50 pb-2">
                  <h3 className="text-lg font-semibold font-poppins text-gray-800">Monthly Performance Metrics</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Monthly Energy Delivered</p>
                      <p className="font-semibold text-gray-900">{formatNumber(monthlyUsage)} kWh</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Monthly Revenue</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(monthlyRevenue)}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600">Monthly Cost</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(monthlyCost)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gray-50 pb-2">
                  <h3 className="text-lg font-semibold font-poppins text-gray-800">Projected Yearly Profits</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700 font-medium">Year</th>
                          {results.profitYears?.map((_, index) => (
                            <th key={index} className="px-4 py-2 text-left text-gray-700 font-medium">Year {index + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 border-t text-gray-900">Profit</td>
                          {results.profitYears?.map((profit, index) => (
                            <td key={index} className="px-4 py-2 border-t text-gray-900">{formatCurrency(profit)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border-t text-gray-900">Cumulative</td>
                          {results.profitYears?.map((_, index) => {
                            const cumulativeProfit = results.profitYears?.slice(0, index + 1).reduce((sum, profit) => sum + profit, 0) || 0;
                            return (
                              <td key={index} className="px-4 py-2 border-t text-gray-900">{formatCurrency(cumulativeProfit)}</td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTable;
