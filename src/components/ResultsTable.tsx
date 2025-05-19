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
  ReferenceLine
} from 'recharts';
import { Download, Mail, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Simplify for barChart - group by quarters
  const barChartData = [];
  
  if (isAC) {
    for (let i = 0; i < maxMonths; i += 3) {
      const quarterLabel = `Q${Math.floor(i / 3) + 1}`;
      barChartData.push({
        name: quarterLabel,
        chargingCost: (results.comparisons?.chargingCosts?.slice(i, i + 3) || []).reduce((sum, v) => sum + v, 0),
        fuelCost: (results.comparisons?.fuelCosts?.slice(i, i + 3) || []).reduce((sum, v) => sum + v, 0)
      });
    }
  } else {
    for (let i = 0; i < maxMonths; i += 3) {
      const quarterLabel = `Q${Math.floor(i / 3) + 1}`;
      barChartData.push({
        name: quarterLabel,
        revenue: (results.comparisons?.revenues?.slice(i, i + 3) || []).reduce((sum, v) => sum + v, 0),
        cost: (results.comparisons?.costs?.slice(i, i + 3) || []).reduce((sum, v) => sum + v, 0),
        profit: (results.comparisons?.profits?.slice(i, i + 3) || []).reduce((sum, v) => sum + v, 0)
      });
    }
  }

  const renderACResults = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-white">Charger & Investment Details</h3>
          <Table className="ev-table border-zinc-700">
            <TableBody>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Charger Type</TableCell>
                <TableCell className="text-right text-white">
                  {charger.name} ({charger.phase} Phase - {charger.power}kW)
                </TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Number of Chargers</TableCell>
                <TableCell className="text-right text-white">
                  {chargerCount} units
                </TableCell>
              </TableRow>
              {civilWorkCost > 0 && (
                <TableRow className="border-zinc-700">
                  <TableCell className="font-medium text-zinc-300">Civil Work Cost</TableCell>
                  <TableCell className="text-right text-white">{formatCurrency(civilWorkCost)}</TableCell>
                </TableRow>
              )}
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Total Investment</TableCell>
                <TableCell className="text-right font-bold text-white">{formatCurrency(totalInvestment)}</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700 bg-green-900/10">
                <TableCell className="font-medium text-zinc-300">Annualized ROI</TableCell>
                <TableCell className="text-right font-bold text-white">
                  {formatNumber(results.annualizedROIPercentage || 0)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-white">Energy & Cost Comparison</h3>
          <Table className="ev-table border-zinc-700">
            <TableBody>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Est. Daily Energy Needed</TableCell>
                <TableCell className="text-right text-white">{formatNumber(results.dailyEnergyRequirement || 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Est. Time for Daily Charge</TableCell>
                <TableCell className="text-right text-white">{formatNumber(results.dailyChargeTime || 0)} hours</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Est. Time for Full Charge (0-100%)</TableCell>
                <TableCell className="text-right text-white">{formatNumber(results.fullChargeTime || 0)} hours</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Monthly Energy Consumption</TableCell>
                <TableCell className="text-right text-white">{formatNumber(results.monthlyUnitsConsumed || 0, 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Monthly Charging Cost</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.monthlyChargingCost || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Monthly Fuel Cost</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.monthlyFuelCost || 0)}</TableCell>
              </TableRow>
              <TableRow className="bg-green-900/20 border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Per km - EV</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.costPerKm || 0)}/km</TableCell>
              </TableRow>
              <TableRow className="bg-red-900/20 border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Per km - Fuel</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.fuelCostPerKm || 0)}/km</TableCell>
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
          <h3 className="font-semibold mb-2 font-poppins text-white">Charger & Investment Details</h3>
          <Table className="ev-table border-zinc-700">
            <TableBody>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Charger Type</TableCell>
                <TableCell className="text-right text-white">
                  {charger.name} ({charger.phase} Phase - {charger.power}kW)
                </TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Number of Chargers</TableCell>
                <TableCell className="text-right text-white">
                  {chargerCount} units
                </TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Warranty Period</TableCell>
                <TableCell className="text-right text-white">
                  {charger.warranty}
                </TableCell>
              </TableRow>
              {civilWorkCost > 0 && (
                <TableRow className="border-zinc-700">
                  <TableCell className="font-medium text-zinc-300">Civil Work Cost</TableCell>
                  <TableCell className="text-right text-white">{formatCurrency(civilWorkCost)}</TableCell>
                </TableRow>
              )}
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Total Investment</TableCell>
                <TableCell className="text-right font-bold text-white">{formatCurrency(totalInvestment)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2 font-poppins text-white">Business Performance</h3>
          <Table className="ev-table border-zinc-700">
            <TableBody>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Daily Units Consumed</TableCell>
                <TableCell className="text-right text-white">{formatNumber(results.dailyUnitsConsumed || 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Monthly Units Consumed</TableCell>
                <TableCell className="text-right text-white">{formatNumber(results.monthlyUnitsConsumed || 0, 0)} kWh</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Monthly Revenue</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.monthlyRevenue || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Monthly Net Revenue</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.monthlyNetRevenue || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Yearly Net Revenue</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(results.yearlyNetRevenue || 0)}</TableCell>
              </TableRow>
              <TableRow className="border-zinc-700">
                <TableCell className="font-medium text-zinc-300">Break-Even Time</TableCell>
                <TableCell className="text-right text-white">
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
        <h3 className="font-semibold mb-2 font-poppins text-white">Yearly Profit Projection</h3>
        <Table className="ev-table border-zinc-700">
          <TableHeader>
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-300">Year</TableHead>
              <TableHead className="text-right text-zinc-300">Profit</TableHead>
              <TableHead className="text-right text-zinc-300">Cumulative Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(results.profitYears || []).map((profit, index) => (
              <TableRow key={index} className="border-zinc-700">
                <TableCell className="text-zinc-300">Year {index + 1}</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(profit)}</TableCell>
                <TableCell className="text-right text-white">{formatCurrency(profit * (index + 1))}</TableCell>
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
        <TabsTrigger value="savings">Cumulative Savings</TabsTrigger>
        <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
        <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
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
              <Bar dataKey="savings" fill="#4CAF74" name="Monthly Savings" />
              <Line 
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#A8A048"
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
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="fuelCost" name="Fuel Cost" fill="#ff7675" />
              <Bar dataKey="chargingCost" name="EV Charging Cost" fill="#4CAF74" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly" className="pt-4">
        <div className="overflow-x-auto">
          <Table className="ev-table">
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>EV Charging Cost</TableHead>
                <TableHead>Fuel Cost</TableHead>
                <TableHead>Monthly Savings</TableHead>
                <TableHead>Cumulative Savings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data: any, index) => (
                <TableRow key={index} className={data.cumulativeSavings >= 0 ? "bg-green-50" : ""}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{formatCurrency(data.chargingCost)}</TableCell>
                  <TableCell>{formatCurrency(data.fuelCost)}</TableCell>
                  <TableCell>{formatCurrency(data.savings)}</TableCell>
                  <TableCell className={data.cumulativeSavings >= 0 ? "text-green-600 font-medium" : ""}>
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
        <TabsTrigger value="profit">Profit Projection</TabsTrigger>
        <TabsTrigger value="comparison">Revenue vs Cost</TabsTrigger>
        <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profit" className="pt-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={Math.ceil(chartData.length / 12) - 1} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="profit" fill="#4CAF74" name="Monthly Profit" />
              <Line 
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#A8A048"
                strokeWidth={2} 
                name="Cumulative Profit"
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
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#4CAF74" />
              <Bar dataKey="cost" name="Cost" fill="#ff7675" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="monthly" className="pt-4">
        <div className="overflow-x-auto">
          <Table className="ev-table">
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Monthly Profit</TableHead>
                <TableHead>Cumulative Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data: any, index) => (
                <TableRow key={index} className={data.cumulativeSavings >= 0 ? "bg-green-50" : ""}>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{formatCurrency(data.revenue)}</TableCell>
                  <TableCell>{formatCurrency(data.cost)}</TableCell>
                  <TableCell>{formatCurrency(data.profit)}</TableCell>
                  <TableCell className={data.cumulativeSavings >= 0 ? "text-green-600 font-medium" : ""}>
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
    <Card className="bg-zinc-800 shadow-lg border border-zinc-700 mt-8">
      <CardHeader className="bg-premium-gradient text-white">
        <CardTitle className="flex items-center justify-between">
          <span className="font-poppins">ROI Calculation Results</span>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
              <Share className="h-4 w-4 mr-1" /> Share
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
              <Download className="h-4 w-4 mr-1" /> Export PDF
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-zinc-400">
                {isAC ? 'Monthly Savings' : 'Monthly Net Revenue'}
              </p>
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(isAC ? (results.monthlySavings || 0) : (results.monthlyNetRevenue || 0))}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-zinc-400">
                {isAC ? 'Yearly Savings' : 'Yearly Net Revenue'}
              </p>
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(isAC ? (results.yearlySavings || 0) : (results.yearlyNetRevenue || 0))}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-zinc-400">Break-even Time</p>
              <p className="text-3xl font-bold text-green-400">
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
          <h3 className="font-semibold font-poppins text-white">
            {isAC ? 'Cost Comparison & Savings Analysis' : 'Revenue, Cost & Profit Analysis'}
          </h3>
          
          {isAC ? renderACCharts() : renderDCCharts()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
