
import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { 
  CalculationResult, 
  formatCurrency, 
  formatNumber, 
  ChargerType 
} from '@/utils/calculatorUtils';
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Cell,
  ReferenceLine,
  PieChart,
  Pie,
  Sector,
  AreaChart
} from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import html2pdf from 'html2pdf.js';

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
  if (!results || !charger) return null;

  const totalInvestment = (charger.price * chargerCount) + civilWorkCost;
  const isAC = charger.type === 'AC';
  
  // Define colors based on ROI years
  const getROIColor = (years: number): string => {
    if (years <= 1.5) return 'bg-green-100 text-green-800';
    if (years <= 2.5) return 'bg-lime-100 text-lime-800';
    if (years <= 3.5) return 'bg-yellow-100 text-yellow-800';
    if (years <= 4.5) return 'bg-amber-100 text-amber-800';
    return 'bg-orange-100 text-orange-800';
  };

  // Prepare chart data - show first 24 months max
  const maxMonths = Math.min((results.comparisons?.months.length || 0), 24);
  const chartData = results.comparisons?.months.slice(0, maxMonths).map((month, index) => {
    if (isAC) {
      return {
        name: month,
        chargingCost: results.comparisons?.chargingCosts?.[index] || 0,
        fuelCost: results.comparisons?.fuelCosts?.[index] || 0,
        savings: results.comparisons?.savingsPerMonth?.[index] || 0,
        cumulativeSavings: results.comparisons?.cumulativeSavings[index] || 0,
      };
    } else {
      return {
        name: month,
        revenue: results.comparisons?.revenues?.[index] || 0,
        cost: results.comparisons?.costs?.[index] || 0,
        profit: results.comparisons?.profits?.[index] || 0,
        cumulativeSavings: results.comparisons?.cumulativeSavings[index] || 0,
      };
    }
  }) || [];

  // Simplify data for pie chart (for DC chargers)
  const pieChartData = isAC ? [] : [
    { name: 'Revenue', value: results.monthlyRevenue || 0, fill: '#4ade80' },
    { name: 'Cost', value: (results.monthlyRevenue || 0) - (results.monthlyNetRevenue || 0), fill: '#f87171' }
  ];

  const handleExportPDF = () => {
    const element = document.getElementById('results-pdf');
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     'thunder-track-roi-calculation.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save();
  };

  const renderACResults = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-gray-800">Charger & Investment Details</h3>
          <Table className="ev-table border-gray-200">
            <TableBody>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Charger Type</TableCell>
                <TableCell className="text-right text-gray-800">
                  {charger.name} ({charger.phase} Phase - {charger.power}kW)
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Number of Chargers</TableCell>
                <TableCell className="text-right text-gray-800">
                  {chargerCount} units
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Total Investment</TableCell>
                <TableCell className="text-right font-bold text-gray-800">{formatCurrency(totalInvestment)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-200 bg-green-50">
                <TableCell className="font-medium text-gray-700">Annualized ROI</TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  {formatNumber(results.annualizedROIPercentage || 0)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-gray-800">Energy & Cost Comparison</h3>
          <Table className="ev-table border-gray-200">
            <TableBody>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Est. Daily Energy Needed</TableCell>
                <TableCell className="text-right text-gray-800">{formatNumber(results.dailyEnergyRequirement || 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Est. Time for Daily Charge</TableCell>
                <TableCell className="text-right text-gray-800">{formatNumber(results.dailyChargeTime || 0)} hours</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Est. Time for Full Charge (0-100%)</TableCell>
                <TableCell className="text-right text-gray-800">{formatNumber(results.fullChargeTime || 0)} hours</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Monthly Energy Consumption</TableCell>
                <TableCell className="text-right text-gray-800">{formatNumber(results.monthlyUnitsConsumed || 0, 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Monthly Charging Cost</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.monthlyChargingCost || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Monthly Fuel Cost</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.monthlyFuelCost || 0)}</TableCell>
              </TableRow>
              <TableRow className="bg-green-50 border-gray-200">
                <TableCell className="font-medium text-gray-700">Per km - EV</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.costPerKm || 0)}/km</TableCell>
              </TableRow>
              <TableRow className="bg-red-50 border-gray-200">
                <TableCell className="font-medium text-gray-700">Per km - Fuel</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.fuelCostPerKm || 0)}/km</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );

  const renderDCResults = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-gray-800">Charger & Investment Details</h3>
          <Table className="ev-table border-gray-200">
            <TableBody>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Charger Type</TableCell>
                <TableCell className="text-right text-gray-800">
                  {charger.name} ({charger.phase} Phase - {charger.power}kW)
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Number of Chargers</TableCell>
                <TableCell className="text-right text-gray-800">
                  {chargerCount} units
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Warranty Period</TableCell>
                <TableCell className="text-right text-gray-800">
                  {charger.warranty}
                </TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Total Investment</TableCell>
                <TableCell className="text-right font-bold text-gray-800">{formatCurrency(totalInvestment)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-gray-800">Business Performance</h3>
          <Table className="ev-table border-gray-200">
            <TableBody>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Daily Units Consumed</TableCell>
                <TableCell className="text-right text-gray-800">{formatNumber(results.dailyUnitsConsumed || 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Monthly Units Consumed</TableCell>
                <TableCell className="text-right text-gray-800">{formatNumber(results.monthlyUnitsConsumed || 0, 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Monthly Revenue</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.monthlyRevenue || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Monthly Net Revenue</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.monthlyNetRevenue || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Yearly Net Revenue</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(results.yearlyNetRevenue || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-gray-200">
                <TableCell className="font-medium text-gray-700">Break-Even Time</TableCell>
                <TableCell className="text-right text-gray-800">
                  {results.breakEvenMonths === Infinity ? 
                    "Never" : 
                    `${Math.floor((results.breakEvenMonths || 0)/12)} years ${Math.round((results.breakEvenMonths || 0) % 12)} months`
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Yearly Profit Projection */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2 font-poppins text-gray-800">Yearly Profit Projection</h3>
        <Table className="ev-table border-gray-200">
          <TableHeader>
            <TableRow className="border-gray-200 bg-gray-50">
              <TableHead className="text-gray-700">Year</TableHead>
              <TableHead className="text-right text-gray-700">Profit</TableHead>
              <TableHead className="text-right text-gray-700">Cumulative Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(results.profitYears || []).map((profit, index) => (
              <TableRow key={index} className="border-gray-200">
                <TableCell className="text-gray-700">Year {index + 1}</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(profit)}</TableCell>
                <TableCell className="text-right text-gray-800">{formatCurrency(profit * (index + 1))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );

  const renderACCharts = () => (
    <Tabs defaultValue="savings" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="savings" className="text-gray-800 data-[state=active]:text-white data-[state=active]:bg-primary">Cumulative Savings</TabsTrigger>
        <TabsTrigger value="comparison" className="text-gray-800 data-[state=active]:text-white data-[state=active]:bg-primary">Cost Comparison</TabsTrigger>
        <TabsTrigger value="monthly" className="text-gray-800 data-[state=active]:text-white data-[state=active]:bg-primary">Monthly Breakdown</TabsTrigger>
      </TabsList>
      
      <TabsContent value="savings" className="pt-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={Math.ceil(chartData.length / 12) - 1} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="savings" fill="#4ade80" name="Monthly Savings" />
              <Line 
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#15803d"
                strokeWidth={2} 
                name="Cumulative Savings"
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-center text-gray-500 mt-2">
          Break-even point: {results.breakEvenMonths === Infinity ? 
            "Never" : 
            `Month ${Math.ceil(results.breakEvenMonths || 0)}`
          }
        </p>
      </TabsContent>
      
      <TabsContent value="comparison" className="pt-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="fuelCost" name="Fuel Cost" fill="#f87171" />
              <Bar dataKey="chargingCost" name="EV Charging Cost" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly" className="pt-4">
        <div className="overflow-x-auto">
          <Table className="ev-table">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Month</TableHead>
                <TableHead className="text-gray-700">EV Charging Cost</TableHead>
                <TableHead className="text-gray-700">Fuel Cost</TableHead>
                <TableHead className="text-gray-700">Monthly Savings</TableHead>
                <TableHead className="text-gray-700">Cumulative Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data: any, index) => (
                <TableRow key={index} className={data.cumulativeSavings >= 0 ? "bg-green-50" : ""}>
                  <TableCell className="text-gray-800">{data.name}</TableCell>
                  <TableCell className="text-gray-800">{formatCurrency(data.chargingCost)}</TableCell>
                  <TableCell className="text-gray-800">{formatCurrency(data.fuelCost)}</TableCell>
                  <TableCell className="text-gray-800">{formatCurrency(data.savings)}</TableCell>
                  <TableCell className={data.cumulativeSavings >= 0 ? "text-green-600 font-medium" : "text-gray-800"}>
                    {formatCurrency(data.cumulativeSavings)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderDCCharts = () => (
    <Tabs defaultValue="profit" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="profit" className="text-gray-800 data-[state=active]:text-white data-[state=active]:bg-primary">Profit Projection</TabsTrigger>
        <TabsTrigger value="comparison" className="text-gray-800 data-[state=active]:text-white data-[state=active]:bg-primary">Revenue vs Cost</TabsTrigger>
        <TabsTrigger value="monthly" className="text-gray-800 data-[state=active]:text-white data-[state=active]:bg-primary">Monthly Breakdown</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profit" className="pt-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={Math.ceil(chartData.length / 12) - 1} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#15803d"
                fillOpacity={1}
                fill="url(#colorProfit)"
                name="Monthly Profit"
              />
              <Line 
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#15803d"
                strokeWidth={2} 
                name="Cumulative Profit"
                dot={{ r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-center text-gray-500 mt-2">
          Break-even point: {results.breakEvenMonths === Infinity ? 
            "Never" : 
            `Month ${Math.ceil(results.breakEvenMonths || 0)}`
          }
        </p>
      </TabsContent>
      
      <TabsContent value="comparison" className="pt-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly" className="pt-4">
        <div className="overflow-x-auto">
          <Table className="ev-table">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Month</TableHead>
                <TableHead className="text-gray-700">Revenue</TableHead>
                <TableHead className="text-gray-700">Cost</TableHead>
                <TableHead className="text-gray-700">Monthly Profit</TableHead>
                <TableHead className="text-gray-700">Cumulative Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data: any, index) => (
                <TableRow key={index} className={data.cumulativeSavings >= 0 ? "bg-green-50" : ""}>
                  <TableCell className="text-gray-800">{data.name}</TableCell>
                  <TableCell className="text-gray-800">{formatCurrency(data.revenue)}</TableCell>
                  <TableCell className="text-gray-800">{formatCurrency(data.cost)}</TableCell>
                  <TableCell className="text-gray-800">{formatCurrency(data.profit)}</TableCell>
                  <TableCell className={data.cumulativeSavings >= 0 ? "text-green-600 font-medium" : "text-gray-800"}>
                    {formatCurrency(data.cumulativeSavings)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div id="results-pdf">
      <Card className="bg-white shadow-lg border border-gray-200 mt-8">
        <CardHeader className="bg-premium-gradient text-white">
          <CardTitle className="flex items-center justify-between">
            <span className="font-poppins">ROI Calculation Results</span>
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={handleExportPDF}
              >
                <Download className="h-4 w-4 mr-1" /> Export PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white border-green-200 shadow">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600">
                  {isAC ? 'Monthly Savings' : 'Monthly Net Revenue'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(isAC ? (results.monthlySavings || 0) : (results.monthlyNetRevenue || 0))}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-green-200 shadow">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600">
                  {isAC ? 'Yearly Savings' : 'Yearly Net Revenue'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(isAC ? (results.yearlySavings || 0) : (results.yearlyNetRevenue || 0))}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-green-200 shadow">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600">Break-even Time</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.breakEvenMonths === Infinity ? 
                    "Never" : 
                    `${Math.floor((results.breakEvenMonths || 0)/12)} years ${Math.round((results.breakEvenMonths || 0) % 12)} months`
                  }
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Render different content based on charger type */}
          {isAC ? renderACResults() : renderDCResults()}
          
          <div className="mt-8 space-y-6">
            <h3 className="font-semibold font-poppins text-gray-800">
              {isAC ? 'Cost Comparison & Savings Analysis' : 'Revenue, Cost & Profit Analysis'}
            </h3>
            
            {isAC ? renderACCharts() : renderDCCharts()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTable;
