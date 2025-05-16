
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
import { Download } from 'lucide-react';
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
  
  // Define colors based on ROI years
  const getROIColor = (years: number): string => {
    if (years <= 1.5) return 'bg-green-100 text-green-800';
    if (years <= 2.5) return 'bg-lime-100 text-lime-800';
    if (years <= 3.5) return 'bg-yellow-100 text-yellow-800';
    if (years <= 4.5) return 'bg-amber-100 text-amber-800';
    return 'bg-orange-100 text-orange-800';
  };

  // Prepare chart data - show first 24 months max
  const maxMonths = Math.min(results.comparisons.months.length, 24);
  const chartData = results.comparisons.months.slice(0, maxMonths).map((month, index) => ({
    name: month,
    chargingCost: results.comparisons.chargingCosts[index],
    fuelCost: results.comparisons.fuelCosts[index],
    savings: results.comparisons.savingsPerMonth[index],
    cumulativeSavings: results.comparisons.cumulativeSavings[index],
  }));

  // Simplify for bartChart - group by quarters
  const barChartData = [];
  for (let i = 0; i < maxMonths; i += 3) {
    const quarterLabel = `Q${Math.floor(i / 3) + 1}`;
    barChartData.push({
      name: quarterLabel,
      chargingCost: results.comparisons.chargingCosts.slice(i, i + 3).reduce((sum, v) => sum + v, 0),
      fuelCost: results.comparisons.fuelCosts.slice(i, i + 3).reduce((sum, v) => sum + v, 0)
    });
  }

  return (
    <Card className="ev-card mt-8">
      <CardHeader className="ev-card-header">
        <CardTitle className="flex items-center justify-between">
          <span>ROI Calculation Results</span>
          <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white">
            <Download className="h-4 w-4 mr-1" /> Export Report
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-evgreen/10 to-evgreen/5 border-evgreen/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Monthly Savings</p>
              <p className="text-3xl font-bold text-evgreen">{formatCurrency(results.monthlySavings)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-evgreen/10 to-evgreen/5 border-evgreen/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Yearly Savings</p>
              <p className="text-3xl font-bold text-evgreen">{formatCurrency(results.yearlySavings)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-evgreen/10 to-evgreen/5 border-evgreen/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Break-even Time</p>
              <p className="text-3xl font-bold text-evgreen">
                {results.breakEvenMonths === Infinity ? 
                  "Never" : 
                  `${Math.floor(results.breakEvenMonths/12)} years ${Math.round(results.breakEvenMonths % 12)} months`
                }
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Charger & Investment Details</h3>
            <Table className="ev-table">
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Charger Type</TableCell>
                  <TableCell className="text-right">
                    {charger.name} ({charger.phase} Phase - {charger.power}kW)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Charger Cost</TableCell>
                  <TableCell className="text-right">
                    {chargerCount} × {formatCurrency(charger.price)} = {formatCurrency(charger.price * chargerCount)}
                  </TableCell>
                </TableRow>
                {civilWorkCost > 0 && (
                  <TableRow>
                    <TableCell className="font-medium">Civil Work Cost</TableCell>
                    <TableCell className="text-right">{formatCurrency(civilWorkCost)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="font-medium">Total Investment</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalInvestment)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Energy & Cost Comparison</h3>
            <Table className="ev-table">
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Daily Energy Requirement</TableCell>
                  <TableCell className="text-right">{formatNumber(results.dailyEnergyRequirement)} kWh</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly Energy Consumption</TableCell>
                  <TableCell className="text-right">{formatNumber(results.monthlyUnitsConsumed, 0)} kWh</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly Charging Cost</TableCell>
                  <TableCell className="text-right">{formatCurrency(results.monthlyChargingCost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly Fuel Cost</TableCell>
                  <TableCell className="text-right">{formatCurrency(results.monthlyFuelCost)}</TableCell>
                </TableRow>
                <TableRow className="bg-green-50">
                  <TableCell className="font-medium">Per km - EV</TableCell>
                  <TableCell className="text-right">{formatCurrency(results.costPerKm)}/km</TableCell>
                </TableRow>
                <TableRow className="bg-red-50">
                  <TableCell className="font-medium">Per km - Fuel</TableCell>
                  <TableCell className="text-right">{formatCurrency(results.fuelCostPerKm)}/km</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="mt-8 space-y-6">
          <h3 className="font-semibold">Cost Comparison & Savings Analysis</h3>
          
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
                  `Month ${Math.ceil(results.breakEvenMonths)}`
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
                    {chartData.map((data, index) => (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
