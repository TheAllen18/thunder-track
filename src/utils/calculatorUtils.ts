
export type ChargerType = {
  id: string;
  name: string;
  power: number; // in kW
  price: number;
  phase: 'Single' | 'Three';
};

export const chargerTypes: ChargerType[] = [
  { 
    id: 'basic',
    name: '3.3kW Basic', 
    power: 3.3, 
    price: 15000,
    phase: 'Single'
  },
  { 
    id: 'standard',
    name: '7.4kW Standard', 
    power: 7.4, 
    price: 45000,
    phase: 'Single'
  },
  { 
    id: 'premium',
    name: '22kW Premium', 
    power: 22, 
    price: 65000,
    phase: 'Three'
  }
];

export type CalculationResult = {
  dailyConsumption: number[];
  monthlyConsumption: number[];
  revenue: number[];
  expenditure: number[];
  operationalCost: number[];
  miscellaneousCost: number[];
  netRevenue: number[];
  roiMonths: number[];
  roiYears: number[];
};

export const calculateROI = (
  charger: ChargerType,
  chargerCount: number = 1,
  revenuePerUnit: number = 18,
  expenditurePerUnit: number = 8,
  operationalCostPerUnit: number = 1,
  miscellaneousCostPerUnit: number = 1,
  daysPerMonth: number = 30,
  hourlyUsageLevels: number[] = [1, 2, 3, 4, 5], // hours of usage per day at different usage levels
  civilWorkCost: number = 0
): CalculationResult => {
  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  
  // Calculate consumption for each usage level
  const dailyConsumption = hourlyUsageLevels.map(hours => hours * charger.power);
  const monthlyConsumption = dailyConsumption.map(daily => daily * daysPerMonth);
  
  // Calculate revenue and costs
  const revenue = monthlyConsumption.map(consumption => consumption * revenuePerUnit);
  const expenditure = monthlyConsumption.map(consumption => consumption * expenditurePerUnit);
  const operationalCost = monthlyConsumption.map(consumption => consumption * operationalCostPerUnit);
  const miscellaneousCost = monthlyConsumption.map(consumption => consumption * miscellaneousCostPerUnit);
  
  // Calculate net revenue
  const netRevenue = revenue.map((rev, i) => 
    rev - (expenditure[i] + operationalCost[i] + miscellaneousCost[i])
  );
  
  // Calculate ROI in months and years
  const roiMonths = netRevenue.map(net => net > 0 ? totalInvestment / net : Infinity);
  const roiYears = roiMonths.map(months => months / 12);

  return {
    dailyConsumption,
    monthlyConsumption,
    revenue,
    expenditure,
    operationalCost,
    miscellaneousCost,
    netRevenue,
    roiMonths,
    roiYears
  };
};

// Format number as currency (INR)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with 1 decimal place
export const formatNumber = (num: number, decimals: number = 1): string => {
  return num === Infinity ? '∞' : num.toFixed(decimals);
};
