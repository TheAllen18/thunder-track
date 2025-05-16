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

export type CalculationInput = {
  charger: ChargerType;
  chargerCount: number;
  civilWorkCost: number;
  dailyKilometers: number;
  carEfficiency: number;
  batterySize?: number;
  chargingFrequency: number;
  electricityCost: number;
  isCommercialProperty: boolean;
  fuelCost: number;
  fuelEfficiency: number;
  timeHorizon: number;
};

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
  // Additional fields for enhanced calculations
  dailyEnergyRequirement: number;
  monthlyUnitsConsumed: number;
  monthlyChargingCost: number;
  dailyFuelNeeded: number;
  monthlyFuelCost: number;
  monthlySavings: number;
  yearlySavings: number;
  totalSavingsOverTime: number;
  totalEnergyConsumed: number;
  costPerKm: number;
  fuelCostPerKm: number;
  breakEvenMonths: number;
  comparisons: {
    months: string[];
    chargingCosts: number[];
    fuelCosts: number[];
    savingsPerMonth: number[];
    cumulativeSavings: number[];
  };
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

// Enhanced ROI calculation with all required inputs
export const calculateEnhancedROI = (input: CalculationInput): CalculationResult => {
  const { 
    charger, 
    chargerCount, 
    civilWorkCost, 
    dailyKilometers, 
    carEfficiency, 
    electricityCost, 
    fuelCost, 
    fuelEfficiency,
    chargingFrequency,
    timeHorizon
  } = input;

  const daysPerMonth = 30;
  const monthsInYear = 12;
  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  
  // Calculate daily energy requirement
  const dailyEnergyRequirement = dailyKilometers / carEfficiency; // kWh
  
  // Monthly energy consumption based on charging frequency (days per week)
  const daysPerWeek = Math.min(chargingFrequency, 7);
  const effectiveMonthlyDays = (daysPerWeek / 7) * daysPerMonth;
  const monthlyUnitsConsumed = dailyEnergyRequirement * effectiveMonthlyDays;
  
  // Cost calculations
  const monthlyChargingCost = monthlyUnitsConsumed * electricityCost;
  const dailyFuelNeeded = dailyKilometers / fuelEfficiency; // liters
  const monthlyFuelCost = dailyFuelNeeded * fuelCost * daysPerMonth;
  
  // Savings
  const monthlySavings = monthlyFuelCost - monthlyChargingCost;
  const yearlySavings = monthlySavings * monthsInYear;
  
  // ROI
  const breakEvenMonths = monthlySavings > 0 ? totalInvestment / monthlySavings : Infinity;
  const roiYears = breakEvenMonths / monthsInYear;
  
  // Additional calculations
  const totalEnergyConsumed = monthlyUnitsConsumed * timeHorizon * monthsInYear;
  const totalSavingsOverTime = monthlySavings * timeHorizon * monthsInYear;
  const costPerKm = monthlyChargingCost / (dailyKilometers * daysPerMonth);
  const fuelCostPerKm = monthlyFuelCost / (dailyKilometers * daysPerMonth);
  
  // Generate comparison data for charts
  const months: string[] = [];
  const chargingCosts: number[] = [];
  const fuelCosts: number[] = [];
  const savingsPerMonth: number[] = [];
  const cumulativeSavings: number[] = [];
  
  let totalSavingsSoFar = -totalInvestment;
  
  for (let i = 1; i <= timeHorizon * monthsInYear; i++) {
    months.push(`Month ${i}`);
    chargingCosts.push(monthlyChargingCost);
    fuelCosts.push(monthlyFuelCost);
    savingsPerMonth.push(monthlySavings);
    
    totalSavingsSoFar += monthlySavings;
    cumulativeSavings.push(totalSavingsSoFar);
  }

  // Compatibility with existing code
  const hourlyUsageLevels = [1, 2, 3, 4, 5];
  const dailyConsumption = hourlyUsageLevels.map(hours => hours * charger.power);
  const monthlyConsumption = dailyConsumption.map(daily => daily * daysPerMonth);
  
  const revenue = monthlyConsumption.map(consumption => consumption * 18); // Default value
  const expenditure = monthlyConsumption.map(consumption => consumption * electricityCost);
  const operationalCost = monthlyConsumption.map(consumption => consumption * 1); // Default value
  const miscellaneousCost = monthlyConsumption.map(consumption => consumption * 1); // Default value
  
  const netRevenue = revenue.map((rev, i) => 
    rev - (expenditure[i] + operationalCost[i] + miscellaneousCost[i])
  );
  
  const roiMonths = netRevenue.map(net => net > 0 ? totalInvestment / net : Infinity);

  return {
    // Original fields
    dailyConsumption,
    monthlyConsumption,
    revenue,
    expenditure,
    operationalCost,
    miscellaneousCost,
    netRevenue,
    roiMonths,
    roiYears: roiMonths.map(months => months / monthsInYear),
    
    // New fields
    dailyEnergyRequirement,
    monthlyUnitsConsumed,
    monthlyChargingCost,
    dailyFuelNeeded,
    monthlyFuelCost,
    monthlySavings,
    yearlySavings,
    totalSavingsOverTime,
    totalEnergyConsumed,
    costPerKm,
    fuelCostPerKm,
    breakEvenMonths,
    comparisons: {
      months,
      chargingCosts,
      fuelCosts,
      savingsPerMonth,
      cumulativeSavings
    }
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
