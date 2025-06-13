import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChargerType, CalculationResult, formatCurrency, formatNumber } from '@/utils/calculatorUtils';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend, Area, AreaChart, Label } from 'recharts';
import html2pdf from 'html2pdf.js';
import { Download, TrendingUp, Clock, IndianRupee, ZoomIn, ArrowDownCircle, Minimize2, HelpCircle, Leaf, BarChart3, Info } from 'lucide-react';
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
  const [zoomedChart, setZoomedChart] = useState<'profit' | 'cost' | null>(null);
  const [hoveredPieSlice, setHoveredPieSlice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  if (!results || !charger) return null;
  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  const isAC = charger.type === 'AC';

  // Format large numbers with commas
  const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Enhanced Y-axis formatter with better spacing
  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${Math.round(value)}`;
  };

  // Enhanced PDF export function with better page formatting
  const exportToPDF = async () => {
    setIsLoading(true);
    const element = document.getElementById('results-for-pdf');
    if (!element) return;

    // Add executive summary and improve styling for PDF
    const executiveSummary = document.createElement('div');
    executiveSummary.innerHTML = `
      <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; page-break-inside: avoid;">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: bold;">Executive Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
          <div><strong>Investment:</strong> ${formatCurrency(totalInvestment)}</div>
          <div><strong>Monthly ${isAC ? 'Savings' : 'Revenue'}:</strong> ${formatCurrency(isAC ? results.monthlySavings || 0 : results.netRevenue[0] || 0)}</div>
          <div><strong>Break-even Time:</strong> ${(results.breakEvenMonths || results.roiMonths[0]) === Infinity ? '∞' : `${formatNumber((results.breakEvenMonths || results.roiMonths[0]) / 12)} years`}</div>
          <div><strong>ROI:</strong> ${formatNumber(results.annualizedROIPercentage || 0, 1)}% per annum</div>
        </div>
      </div>
    `;

    // Add PDF-specific styling
    const pdfStyles = document.createElement('style');
    pdfStyles.innerHTML = `
      @media print {
        .chart-container { page-break-inside: avoid; margin-bottom: 20px; }
        .metrics-grid { page-break-inside: avoid; }
        .summary-table { page-break-inside: avoid; }
        h3 { page-break-after: avoid; }
        .space-y-6 > * { margin-bottom: 20px !important; }
        .grid { page-break-inside: avoid; }
      }
    `;
    document.head.appendChild(pdfStyles);
    element.insertBefore(executiveSummary, element.firstChild);
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `${charger.name}_${isAC ? 'Savings' : 'ROI'}_Analysis.pdf`,
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
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.page-break-avoid'
      }
    };
    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      element.removeChild(executiveSummary);
      document.head.removeChild(pdfStyles);
      setIsLoading(false);
    }
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
    operational: '#FB923C',
    miscellaneous: '#8B5CF6'
  };

  // Get the first usage level (for AC) or first value (for DC)
  const monthlyUsage = isAC ? results.monthlyUnitsConsumed || 0 : results.monthlyConsumption[0] || 0;
  const breakEvenMonths = isAC ? results.breakEvenMonths || 0 : results.roiMonths[0] || 0;
  const monthlyRevenue = isAC ? 0 : results.revenue[0] || 0;
  const monthlyCost = isAC ? 0 : results.expenditure[0] + results.operationalCost[0] + results.miscellaneousCost[0] || 0;
  const monthlyProfit = isAC ? 0 : results.netRevenue[0] || 0;

  // Calculate metrics for key cards
  const monthlySavings = isAC ? results.monthlySavings || 0 : results.netRevenue[0] || 0;
  const yearlySavings = isAC ? results.yearlySavings || 0 : results.yearlyNetRevenue || 0;

  // Calculate ROI percentage
  const roiPercentage = results.annualizedROIPercentage || 0;

  // Calculate carbon footprint savings (approximate)
  const carbonSavingsKg = isAC ? monthlyUsage * 0.82 * 12 : 0; // 0.82 kg CO2/kWh average grid emission

  // Convert break-even time to years and format appropriately
  const breakEvenYears = breakEvenMonths / 12;
  const breakEvenTimeDisplayValue = breakEvenMonths === Infinity ? '∞' : `${formatNumber(breakEvenYears)} years`;

  // Check for public charging comparison
  const hasPublicChargingData = isAC && results.publicChargingMonthlyCost !== undefined && results.publicChargingMonthlyCost > 0;

  // Calculate comparison metrics
  const comparisonCost = hasPublicChargingData ? results.publicChargingMonthlyCost || 0 : results.monthlyFuelCost || 0;
  const homeChargingCost = results.monthlyChargingCost || 0;
  const savingsPercentage = comparisonCost > 0 ? (comparisonCost - homeChargingCost) / comparisonCost * 100 : 0;

  // Prepare chart data
  const prepareChartData = () => {
    if (isAC) {
      return results.comparisons?.months.map((month, index) => ({
        month,
        HomeCharging: results.comparisons?.chargingCosts?.[index] || 0,
        ...(hasPublicChargingData ? {
          PublicCharging: results.comparisons?.publicChargingCosts?.[index] || 0
        } : {
          Fuel: results.comparisons?.fuelCosts?.[index] || 0
        }),
        Savings: results.comparisons?.savingsPerMonth?.[index] || 0,
        CumulativeSavings: results.comparisons?.cumulativeSavings[index] || 0
      }));
    } else {
      return results.comparisons?.months.map((month, index) => ({
        month,
        CumulativeProfit: results.comparisons?.cumulativeSavings[index] || 0,
        MonthlyProfit: results.comparisons?.profits?.[index] || 0,
        Revenue: results.comparisons?.revenues?.[index] || 0,
        Cost: results.comparisons?.costs?.[index] || 0
      }));
    }
  };
  const chartData = prepareChartData() || [];

  // Enhanced pie chart data with better categorization
  const costBreakdownData = [{
    name: 'Revenue',
    value: monthlyRevenue,
    color: colors.revenue
  }, {
    name: 'Electricity',
    value: results.expenditure[0] || 0,
    color: colors.cost
  }, {
    name: 'Operational',
    value: results.operationalCost[0] || 0,
    color: colors.operational
  }, {
    name: 'Miscellaneous',
    value: results.miscellaneousCost[0] || 0,
    color: colors.miscellaneous
  }].filter(item => item.value > 0);
  const acCostBreakdownData = [{
    name: 'Home Charging',
    value: results.monthlyChargingCost || 0,
    color: colors.charging
  }, hasPublicChargingData ? {
    name: 'Public Charging',
    value: results.publicChargingMonthlyCost || 0,
    color: colors.publicCharging
  } : {
    name: 'Fuel',
    value: results.monthlyFuelCost || 0,
    color: colors.fuel
  }].filter(item => item.value > 0);
  const pieData = isAC ? acCostBreakdownData : costBreakdownData;
  const handleChartZoom = (chartType: 'profit' | 'cost') => {
    setZoomedChart(chartType === zoomedChart ? null : chartType);
  };

  // Enhanced custom label renderer with better positioning and percentage display
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value
  }: any) => {
    if (percent < 0.01) return null; // Lower threshold to show more labels

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium" fontSize="11">
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>;
  };

  // Enhanced tooltip with more information
  const renderEnhancedTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => <p key={index} style={{
          color: entry.color
        }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>)}
        </div>;
    }
    return null;
  };
  return <TooltipProvider>
      <div className="mt-8" id="results-for-pdf">
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-premium-gradient text-white flex flex-row justify-between items-center rounded-t-xl">
            <CardTitle className="font-poppins">
              {isAC ? 'Savings Analysis Results' : 'ROI Analysis Results'}
            </CardTitle>
            <Button onClick={exportToPDF} variant="outline" disabled={isLoading} className="bg-white/20 text-white hover:bg-white/30 border-white/30 transition-all">
              <Download className="h-4 w-4 mr-2" /> 
              {isLoading ? 'Generating...' : 'Export PDF'}
            </Button>
          </CardHeader>
          
          <CardContent className="p-6 space-y-8">
            {/* Enhanced Key Metrics Dashboard Cards - Removed ROI card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 metrics-grid">
              <Card className="shadow-md border-l-4 border-l-green-500 hover:shadow-lg transition-all group hover:translate-y-[-2px] duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Monthly Profits
                    </p>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{formatCurrency(monthlySavings)}</h3>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full group-hover:bg-green-200 transition-colors">
                      <IndianRupee className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition-all group hover:translate-y-[-2px] duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Yearly Profits</p>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{formatCurrency(yearlySavings)}</h3>
                    </div>
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                      <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-l-4 border-l-purple-500 hover:shadow-lg transition-all group hover:translate-y-[-2px] duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Break-even Time</p>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{breakEvenTimeDisplayValue}</h3>
                    </div>
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                      <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Metrics Summary */}
            {isAC && <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold font-poppins text-gray-800">Cost Comparison Summary</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comparison between home charging and {hasPublicChargingData ? 'public charging' : 'fuel'} costs</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-gray-600 text-sm">You save</p>
                      <p className="font-bold text-green-700 text-xl">{formatNumber(savingsPercentage, 1)}%</p>
                      <p className="text-xs text-gray-500">vs {hasPublicChargingData ? 'public charging' : 'fuel'}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-600 text-sm">Monthly savings</p>
                      <p className="font-bold text-blue-700 text-xl">{formatCurrency(comparisonCost - homeChargingCost)}</p>
                      <p className="text-xs text-gray-500">in your pocket</p>
                    </div>

                    {carbonSavingsKg > 0 && <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-emerald-600" />
                          <p className="text-gray-600 text-sm">CO₂ saved/year</p>
                        </div>
                        <p className="font-bold text-emerald-700 text-xl">{formatNumber(carbonSavingsKg)} kg</p>
                        <p className="text-xs text-gray-500">environmental impact</p>
                      </div>}
                  </div>
                </CardContent>
              </Card>}

            {/* Charger & Investment Details */}
            <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="bg-gray-50 pb-2">
                <h3 className="text-lg font-semibold font-poppins text-gray-800">Investment Overview</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-gray-600 text-sm">Selected Charger</p>
                    <p className="font-semibold text-gray-900">{charger.name}</p>
                    <p className="text-xs text-gray-500">{charger.power}kW {charger.type}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-gray-600 text-sm">Quantity & Investment</p>
                    <p className="font-semibold text-gray-900">{chargerCount} unit{chargerCount > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(totalInvestment)} total</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="text-gray-600 text-sm">Payback Period</p>
                    <p className="font-semibold text-gray-900">{breakEvenTimeDisplayValue}</p>
                    <p className="text-xs text-gray-500">to recover investment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Charts Section */}
            <div className="space-y-6">
              <div className={`grid gap-6 transition-all duration-500 ${zoomedChart ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                
                {/* Savings/Profit Projection Chart */}
                <Card className={`shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-500 chart-container ${zoomedChart === 'profit' ? 'lg:col-span-2 transform scale-[1.02]' : ''}`}>
                  <CardHeader className="bg-gray-50 pb-3 flex flex-row justify-between items-center">
                    <h3 className="text-lg font-semibold font-poppins text-gray-800">
                      {isAC ? 'Savings Projection' : 'Profit Projection'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => handleChartZoom('profit')} className="h-8 w-8 p-0 hover:bg-gray-200/50 transition-all duration-200">
                      {zoomedChart === 'profit' ? <Minimize2 className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className={`transition-all duration-700 ease-in-out ${zoomedChart === 'profit' ? 'h-[500px] sm:h-[600px]' : 'h-[300px] sm:h-[400px]'}`}>
                      <ChartContainer config={{
                      CumulativeProfit: {
                        label: 'Cumulative Profit',
                        color: colors.profit
                      },
                      CumulativeSavings: {
                        label: 'Cumulative Savings',
                        color: colors.savings
                      }
                    }} className="w-full h-full">
                        {isAC ? <AreaChart data={chartData} margin={{
                        top: 30,
                        right: 30,
                        left: 80,
                        bottom: 80
                      }}>
                            <defs>
                              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="month" tick={{
                          fontSize: 11
                        }} tickFormatter={value => value.replace('Month ', '')} interval={Math.max(0, Math.floor(chartData.length / 8))} height={60}>
                              <Label value="Months" position="insideBottom" offset={-20} />
                            </XAxis>
                            <YAxis tick={{
                          fontSize: 10
                        }} tickFormatter={formatYAxis} width={70} interval={0} tickCount={6}>
                              <Label value="Amount (₹)" position="insideLeft" angle={-90} offset={10} style={{
                            textAnchor: 'middle'
                          }} />
                            </YAxis>
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Legend content={<ChartLegendContent />} wrapperStyle={{
                          paddingTop: '20px',
                          paddingBottom: '10px'
                        }} />
                            <ReferenceLine y={0} stroke={colors.breakEven} strokeWidth={1} strokeDasharray="5 5" />
                            
                            <Area type="monotone" name="CumulativeSavings" dataKey="CumulativeSavings" stroke={colors.savings} strokeWidth={3} fill="url(#colorSavings)" activeDot={{
                          r: 6,
                          stroke: 'white',
                          strokeWidth: 2,
                          fill: colors.savings
                        }} isAnimationActive={true} animationDuration={1500} />
                          </AreaChart> : <AreaChart data={chartData} margin={{
                        top: 30,
                        right: 30,
                        left: 80,
                        bottom: 80
                      }}>
                            <defs>
                              <linearGradient id="colorCumulativeProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="month" tick={{
                          fontSize: 11
                        }} tickFormatter={value => value.replace('Month ', '')} interval={Math.max(0, Math.floor(chartData.length / 8))} height={60}>
                              <Label value="Months" position="insideBottom" offset={-20} />
                            </XAxis>
                            <YAxis tick={{
                          fontSize: 10
                        }} tickFormatter={formatYAxis} width={70} interval={0} tickCount={6}>
                              <Label value="Amount (₹)" position="insideLeft" angle={-90} offset={10} style={{
                            textAnchor: 'middle'
                          }} />
                            </YAxis>
                            <RechartsTooltip content={<ChartTooltipContent />} />
                            <Legend content={<ChartLegendContent />} wrapperStyle={{
                          paddingTop: '20px',
                          paddingBottom: '10px'
                        }} />
                            <ReferenceLine y={0} stroke={colors.breakEven} strokeWidth={1} strokeDasharray="5 5" />
                            
                            <Area type="monotone" name="CumulativeProfit" dataKey="CumulativeProfit" stroke="#22C55E" strokeWidth={3} fill="url(#colorCumulativeProfit)" activeDot={{
                          r: 6,
                          stroke: 'white',
                          strokeWidth: 2,
                          fill: "#22C55E"
                        }} isAnimationActive={true} animationDuration={1500} />
                          </AreaChart>}
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Cost Comparison / Revenue vs Cost Breakdown Chart - Increased size */}
                <Card className={`shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-500 chart-container ${zoomedChart === 'cost' ? 'lg:col-span-2 transform scale-[1.02]' : ''}`}>
                  <CardHeader className="bg-gray-50 pb-3 flex flex-row justify-between items-center">
                    <h3 className="text-lg font-semibold font-poppins text-gray-800">
                      {isAC ? 'Cost Comparison' : 'Revenue vs. Cost Breakdown'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => handleChartZoom('cost')} className="h-8 w-8 p-0 hover:bg-gray-200/50 transition-all duration-200">
                      {zoomedChart === 'cost' ? <Minimize2 className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className={`transition-all duration-700 ease-in-out ${zoomedChart === 'cost' ? 'h-[500px] sm:h-[600px]' : 'h-[300px] sm:h-[400px]'}`}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{
                        top: 20,
                        right: 20,
                        bottom: 100,
                        left: 20
                      }}>
                          <Pie data={pieData} cx="50%" cy="40%" labelLine={false} outerRadius={zoomedChart === 'cost' ? '65%' : '55%'} fill="#8884d8" dataKey="value" nameKey="name" label={renderCustomLabel} animationDuration={1200} animationBegin={200} animationEasing="ease-out" onMouseEnter={data => setHoveredPieSlice(data.name)} onMouseLeave={() => setHoveredPieSlice(null)}>
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} style={{
                            filter: hoveredPieSlice === entry.name ? 'brightness(1.1)' : 'none',
                            transition: 'filter 0.2s'
                          }} />)}
                          </Pie>
                          <RechartsTooltip content={renderEnhancedTooltip} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{
                          paddingTop: '30px',
                          fontSize: window.innerWidth < 640 ? '10px' : '12px'
                        }} iconType="rect" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Summary Table with Exact Values */}
            <Card className="shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all summary-table">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold font-poppins text-gray-800">Financial Summary</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detailed breakdown of all costs and savings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Metric</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Monthly</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Yearly</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isAC ? <>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">Home Charging Cost</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(results.monthlyChargingCost || 0)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency((results.monthlyChargingCost || 0) * 12)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Electricity cost for EV</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{hasPublicChargingData ? 'Public Charging Cost' : 'Fuel Cost'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(comparisonCost)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(comparisonCost * 12)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Alternative cost</td>
                          </tr>
                          <tr className="hover:bg-green-50 bg-green-50">
                            <td className="px-4 py-3 text-sm font-medium text-green-800">Monthly Savings</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-800">{formatCurrency(monthlySavings)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-800">{formatCurrency(yearlySavings)}</td>
                            <td className="px-4 py-3 text-sm text-green-600">Money saved</td>
                          </tr>
                        </> : <>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">Monthly Revenue</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(monthlyRevenue)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(monthlyRevenue * 12)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Income from charging</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">Monthly Costs</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(monthlyCost)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(monthlyCost * 12)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Total operational costs</td>
                          </tr>
                          <tr className="hover:bg-green-50 bg-green-50">
                            <td className="px-4 py-3 text-sm font-medium text-green-800">Net Profit</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-800">{formatCurrency(monthlyProfit)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-800">{formatCurrency(yearlySavings)}</td>
                            <td className="px-4 py-3 text-sm text-green-600">Profit after costs</td>
                          </tr>
                        </>}
                    </tbody>
                  </table>
                  
                  {/* ROI Summary Row */}
                  
                </div>
              </CardContent>
            </Card>

            {/* AC Charger Results */}
            {isAC && <div className="space-y-6">
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
                      
                      {hasPublicChargingData ? <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
                          <p className="text-gray-600">Public Charging Cost</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(results.publicChargingMonthlyCost || 0)}</p>
                        </div> : <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500 hover:bg-gray-100 transition-colors">
                          <p className="text-gray-600">Fuel Cost</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(results.monthlyFuelCost || 0)}</p>
                        </div>}
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
              </div>}
            
            {/* DC Charger Results */}
            {!isAC && <div className="space-y-6">
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
                            {results.profitYears?.map((_, index) => <th key={index} className="px-4 py-2 text-left text-gray-700 font-medium">Year {index + 1}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border-t text-gray-900">Profit</td>
                            {results.profitYears?.map((profit, index) => <td key={index} className="px-4 py-2 border-t text-gray-900">{formatCurrency(profit)}</td>)}
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-t text-gray-900">Cumulative</td>
                            {results.profitYears?.map((_, index) => {
                          const cumulativeProfit = results.profitYears?.slice(0, index + 1).reduce((sum, profit) => sum + profit, 0) || 0;
                          return <td key={index} className="px-4 py-2 border-t text-gray-900">{formatCurrency(cumulativeProfit)}</td>;
                        })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>;
};
export default ResultsTable;