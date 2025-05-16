
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
  
  // Define colors based on ROI years - these align with the image colors
  const getROIColor = (years: number): string => {
    if (years <= 1.5) return 'bg-green-100 text-green-800';
    if (years <= 2.5) return 'bg-lime-100 text-lime-800';
    if (years <= 3.5) return 'bg-yellow-100 text-yellow-800';
    if (years <= 4.5) return 'bg-amber-100 text-amber-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <Card className="ev-card mt-8">
      <CardHeader className="ev-card-header">
        <CardTitle className="flex items-center gap-2">
          ROI Calculation Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table className="ev-table">
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Parameter</TableHead>
              <TableHead className="text-center">MIN<br/>(1hr/day)</TableHead>
              <TableHead className="text-center">LOW<br/>(2hrs/day)</TableHead>
              <TableHead className="text-center">MOD<br/>(3hrs/day)</TableHead>
              <TableHead className="text-center">HIGH<br/>(4hrs/day)</TableHead>
              <TableHead className="text-center">MAX<br/>(5hrs/day)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Charger Type</TableCell>
              <TableCell colSpan={5} className="text-center bg-gray-100">
                {charger.name} ({charger.phase} Phase - {charger.power}kW)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Chargers</TableCell>
              <TableCell colSpan={5} className="text-center">
                {chargerCount} × {formatCurrency(charger.price)} = {formatCurrency(charger.price * chargerCount)}
              </TableCell>
            </TableRow>
            {civilWorkCost > 0 && (
              <TableRow>
                <TableCell className="font-medium">Civil Work Cost</TableCell>
                <TableCell colSpan={5} className="text-center">
                  {formatCurrency(civilWorkCost)}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-medium">Total Investment</TableCell>
              <TableCell colSpan={5} className="text-center font-bold bg-gray-100">
                {formatCurrency(totalInvestment)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Daily Consumption (kWh)</TableCell>
              {results.dailyConsumption.map((value, i) => (
                <TableCell key={i} className="text-center">
                  {formatNumber(value)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly Consumption (kWh)</TableCell>
              {results.monthlyConsumption.map((value, i) => (
                <TableCell key={i} className="text-center bg-gray-100">
                  {formatNumber(value, 0)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly Revenue</TableCell>
              {results.revenue.map((value, i) => (
                <TableCell key={i} className="text-center bg-green-50">
                  {formatCurrency(value)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Electricity Cost</TableCell>
              {results.expenditure.map((value, i) => (
                <TableCell key={i} className="text-center bg-yellow-50">
                  {formatCurrency(value)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Operational Cost</TableCell>
              {results.operationalCost.map((value, i) => (
                <TableCell key={i} className="text-center bg-blue-50">
                  {formatCurrency(value)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Miscellaneous Cost</TableCell>
              {results.miscellaneousCost.map((value, i) => (
                <TableCell key={i} className="text-center bg-blue-50">
                  {formatCurrency(value)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly Net Revenue</TableCell>
              {results.netRevenue.map((value, i) => (
                <TableCell key={i} className="text-center font-bold bg-lime-50">
                  {formatCurrency(value)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ROI (Months)</TableCell>
              {results.roiMonths.map((value, i) => (
                <TableCell key={i} className="text-center">
                  {formatNumber(value, 1)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ROI (Years)</TableCell>
              {results.roiYears.map((value, i) => (
                <TableCell key={i} className={`text-center font-bold ${getROIColor(value)}`}>
                  {formatNumber(value, 1)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
