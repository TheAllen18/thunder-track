
export type ChargerType = {
  id: string;
  name: string;
  power: number; // in kW
  price: number;
  phase: 'Single' | 'Three';
  type: 'AC' | 'DC';
  warranty: string;
};

export const acChargerTypes: ChargerType[] = [
  { 
    id: 'basic',
    name: 'Thunder Lite 3.3 kW AC', 
    power: 3.3, 
    price: 15000,
    phase: 'Single',
    type: 'AC',
    warranty: '1 Year'
  },
  { 
    id: 'standard',
    name: 'Thunder Smart 7.4 kW AC', 
    power: 7.4, 
    price: 45000,
    phase: 'Single',
    type: 'AC',
    warranty: '1 Year'
  },
  { 
    id: 'premium',
    name: 'Thunder Blaze 22 kW AC', 
    power: 22, 
    price: 65000,
    phase: 'Three',
    type: 'AC',
    warranty: '1 Year'
  }
];

export const dcChargerTypes: ChargerType[] = [
  {
    id: 'dc30',
    name: 'Thunder Swift 30 kW DC',
    power: 30,
    price: 600000,
    phase: 'Three',
    type: 'DC',
    warranty: '2 Years'
  },
  {
    id: 'dc60',
    name: 'Thunder Falcon 60 kW DC',
    power: 60,
    price: 1200000,
    phase: 'Three',
    type: 'DC',
    warranty: '2 Years'
  },
  {
    id: 'dc120',
    name: 'Thunder Hulk 120 kW DC',
    power: 120,
    price: 1500000,
    phase: 'Three',
    type: 'DC',
    warranty: '2 Years'
  },
  {
    id: 'dc240',
    name: 'Thunder Hornet 240 kW DC',
    power: 240,
    price: 3200000,
    phase: 'Three',
    type: 'DC',
    warranty: '3 Years'
  }
];

export type CalculationInput = {
  charger: ChargerType;
  chargerCount: number;
  civilWorkCost: number;
  dailyKilometers?: number;
  batterySize: number;
  chargingFrequency?: number;
  electricityCost: number;
  utilizationRate: number; // Added missing property
  electricityRate: number; // Added missing property
  isCommercialProperty?: boolean;
  fuelCost?: number;
  fuelEfficiency?: number;
  timeHorizon: number;
  // New DC-specific fields
  dailyOperatingHours?: number;
  averageCustomersPerDay?: number;
  revenuePerUnit: number;
  operationalCostPerUnit: number;
  miscellaneousCostPerUnit: number;
  // New AC comparison field
  publicChargingCost?: number;
  usePublicChargingComparison?: boolean;
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
  dailyEnergyRequirement?: number;
  monthlyUnitsConsumed?: number;
  monthlyChargingCost?: number;
  dailyFuelNeeded?: number;
  monthlyFuelCost?: number;
  monthlySavings?: number;
  yearlySavings?: number;
  totalSavingsOverTime?: number;
  totalEnergyConsumed?: number;
  costPerKm?: number;
  fuelCostPerKm?: number;
  breakEvenMonths?: number;
  // Additional fields for DC chargers
  dailyUnitsConsumed?: number;
  monthlyRevenue?: number;
  monthlyNetRevenue?: number;
  yearlyNetRevenue?: number;
  profitYears?: number[];
  // New AC-specific fields
  dailyChargeTime?: number;
  fullChargeTime?: number;
  annualizedROIPercentage?: number;
  // New public charging comparison fields
  publicChargingMonthlyCost?: number;
  publicChargingSavings?: number;
  publicChargingYearlySavings?: number;
  comparisons?: {
    months: string[];
    chargingCosts?: number[];
    fuelCosts?: number[];
    publicChargingCosts?: number[];
    savingsPerMonth?: number[];
    cumulativeSavings: number[];
    revenues?: number[];
    costs?: number[];
    profits?: number[];
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

  // Add placeholder values for the additional fields to satisfy the type
  return {
    dailyConsumption,
    monthlyConsumption,
    revenue,
    expenditure,
    operationalCost,
    miscellaneousCost,
    netRevenue,
    roiMonths,
    roiYears,
    dailyEnergyRequirement: 0,
    monthlyUnitsConsumed: 0,
    monthlyChargingCost: 0,
    dailyFuelNeeded: 0,
    monthlyFuelCost: 0,
    monthlySavings: 0,
    yearlySavings: 0,
    totalSavingsOverTime: 0,
    totalEnergyConsumed: 0,
    costPerKm: 0,
    fuelCostPerKm: 0,
    breakEvenMonths: 0,
    comparisons: {
      months: [],
      chargingCosts: [],
      fuelCosts: [],
      savingsPerMonth: [],
      cumulativeSavings: []
    }
  };
};

// Enhanced ROI calculation with all required inputs
export const calculateEnhancedROI = (input: CalculationInput): CalculationResult => {
  const { 
    charger, 
    chargerCount, 
    civilWorkCost, 
    dailyKilometers, 
    batterySize, 
    electricityCost, 
    fuelCost, 
    fuelEfficiency,
    chargingFrequency,
    timeHorizon,
    revenuePerUnit,
    averageCustomersPerDay,
    operationalCostPerUnit,
    miscellaneousCostPerUnit,
    publicChargingCost,
    usePublicChargingComparison
  } = input;

  const daysPerMonth = 30;
  const monthsInYear = 12;
  const totalInvestment = charger.price * chargerCount + civilWorkCost;
  
  // DC Charger ROI Calculation - FIXED
  if (charger.type === 'DC') {
    const dailyOperatingHours = input.dailyOperatingHours || 3; // Default 3 hours
    const operationalCostPerUnitValue = operationalCostPerUnit || 1;
    const miscellaneousCostPerUnitValue = miscellaneousCostPerUnit || 1;
    
    // FIXED: Calculate daily consumption correctly - charger power × operating hours (not × customers)
    const dailyConsumption = charger.power * dailyOperatingHours;
    const monthlyConsumption = dailyConsumption * daysPerMonth;
    
    // Calculate revenue and costs using the correct monthly consumption
    const revenue = monthlyConsumption * revenuePerUnit;
    const expenditure = monthlyConsumption * electricityCost;
    const operationalCost = monthlyConsumption * operationalCostPerUnitValue;
    const miscellaneousCost = monthlyConsumption * miscellaneousCostPerUnitValue;
    
    // Calculate net revenue
    const monthlyNetRevenue = revenue - (expenditure + operationalCost + miscellaneousCost);
    const yearlyNetRevenue = monthlyNetRevenue * 12;
    
    // Calculate ROI in months and years
    const breakEvenMonths = monthlyNetRevenue > 0 ? totalInvestment / monthlyNetRevenue : Infinity;
    const roiYears = breakEvenMonths / 12;
    
    // Calculate profit for years 1-7
    const profitYears = Array.from({ length: 7 }, (_, i) => yearlyNetRevenue * (i + 1));
    
    // Generate comparison data for charts based on actual timeHorizon
    const months = Array.from({ length: timeHorizon * 12 }, (_, i) => `Month ${i + 1}`);
    const revenues = Array(timeHorizon * 12).fill(revenue);
    const costs = Array(timeHorizon * 12).fill(expenditure + operationalCost + miscellaneousCost);
    const netRevenues = Array(timeHorizon * 12).fill(monthlyNetRevenue);
    
    let cumulativeSavings = [];
    let cumulativeValue = -totalInvestment;
    
    for (let i = 0; i < timeHorizon * 12; i++) {
      cumulativeValue += monthlyNetRevenue;
      cumulativeSavings.push(cumulativeValue);
    }
    
    return {
      dailyConsumption: [dailyConsumption],
      monthlyConsumption: [monthlyConsumption],
      revenue: [revenue],
      expenditure: [expenditure],
      operationalCost: [operationalCost],
      miscellaneousCost: [miscellaneousCost],
      netRevenue: [monthlyNetRevenue],
      roiMonths: [breakEvenMonths],
      roiYears: [roiYears],
      dailyUnitsConsumed: dailyConsumption,
      monthlyUnitsConsumed: monthlyConsumption,
      monthlyRevenue: revenue,
      monthlyNetRevenue: monthlyNetRevenue,
      yearlyNetRevenue: yearlyNetRevenue,
      profitYears: profitYears,
      breakEvenMonths: breakEvenMonths,
      comparisons: {
        months: months,
        revenues: revenues,
        costs: costs,
        cumulativeSavings: cumulativeSavings,
        profits: netRevenues
      }
    };
  }
  
  // AC Charger ROI Calculation (unchanged)
  else {
    // Calculate daily energy requirement based on battery size and daily kilometers
    const dailyEnergyRequirement = Math.min(dailyKilometers ? dailyKilometers / 5 : batterySize * 0.8, batterySize); // kWh, limit to max 80% of battery
    
    // Calculate charging times - new calculations
    const dailyChargeTime = dailyEnergyRequirement / charger.power; // Hours needed to charge daily energy
    const fullChargeTime = batterySize / charger.power; // Hours needed for full charge (0-100%)
    
    // Monthly energy consumption based on charging frequency (days per week)
    const daysPerWeek = Math.min(chargingFrequency || 7, 7);
    const effectiveMonthlyDays = (daysPerWeek / 7) * daysPerMonth;
    const monthlyUnitsConsumed = dailyEnergyRequirement * effectiveMonthlyDays;
    
    // Cost calculations
    const monthlyChargingCost = monthlyUnitsConsumed * electricityCost;
    const dailyFuelNeeded = dailyKilometers && fuelEfficiency ? dailyKilometers / fuelEfficiency : 0; // liters
    const monthlyFuelCost = dailyFuelNeeded * (fuelCost || 0) * daysPerMonth;
    
    // Public charging comparison
    const publicChargingMonthlyCost = usePublicChargingComparison && publicChargingCost 
      ? monthlyUnitsConsumed * publicChargingCost 
      : 0;
    
    // Savings calculation - compare with fuel or public charging based on user selection
    const comparisonCost = usePublicChargingComparison ? publicChargingMonthlyCost : monthlyFuelCost;
    const monthlySavings = comparisonCost - monthlyChargingCost;
    const yearlySavings = monthlySavings * monthsInYear;
    
    // Calculate public charging specific savings if selected
    const publicChargingSavings = usePublicChargingComparison ? publicChargingMonthlyCost - monthlyChargingCost : 0;
    const publicChargingYearlySavings = publicChargingSavings * monthsInYear;
    
    // ROI
    const breakEvenMonths = monthlySavings > 0 ? totalInvestment / monthlySavings : Infinity;
    const roiYears = breakEvenMonths / monthsInYear;
    
    // New: Annualized ROI percentage
    const annualizedROIPercentage = (yearlySavings / totalInvestment) * 100;
    
    // Additional calculations
    const totalEnergyConsumed = monthlyUnitsConsumed * timeHorizon * monthsInYear;
    const totalSavingsOverTime = monthlySavings * timeHorizon * monthsInYear;
    const costPerKm = dailyKilometers ? monthlyChargingCost / (dailyKilometers * effectiveMonthlyDays) : 0;
    const fuelCostPerKm = dailyKilometers ? monthlyFuelCost / (dailyKilometers * daysPerMonth) : 0;
    
    // Generate comparison data for charts
    const months: string[] = [];
    const chargingCosts: number[] = [];
    const fuelCosts: number[] = [];
    const publicChargingCosts: number[] = [];
    const savingsPerMonth: number[] = [];
    const cumulativeSavings: number[] = [];
    
    let totalSavingsSoFar = -totalInvestment;
    
    for (let i = 1; i <= timeHorizon * monthsInYear; i++) {
      months.push(`Month ${i}`);
      chargingCosts.push(monthlyChargingCost);
      fuelCosts.push(monthlyFuelCost);
      publicChargingCosts.push(publicChargingMonthlyCost);
      savingsPerMonth.push(monthlySavings);
      
      totalSavingsSoFar += monthlySavings;
      cumulativeSavings.push(totalSavingsSoFar);
    }

    // Compatibility with existing code
    const hourlyUsageLevels = [1, 2, 3, 4, 5];
    const dailyConsumption = hourlyUsageLevels.map(hours => hours * charger.power);
    const monthlyConsumption = dailyConsumption.map(daily => daily * daysPerMonth);
    
    const revenue = monthlyConsumption.map(consumption => consumption * revenuePerUnit);
    const expenditure = monthlyConsumption.map(consumption => consumption * electricityCost);
    const operationalCost = monthlyConsumption.map(consumption => consumption * 1); // Fixed at ₹1
    const miscellaneousCost = monthlyConsumption.map(consumption => consumption * 1); // Fixed at ₹1
    
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
      // New calculations
      dailyChargeTime,
      fullChargeTime,
      annualizedROIPercentage,
      // Public charging comparison
      publicChargingMonthlyCost,
      publicChargingSavings,
      publicChargingYearlySavings,
      comparisons: {
        months,
        chargingCosts,
        fuelCosts,
        publicChargingCosts,
        savingsPerMonth,
        cumulativeSavings
      }
    };
  }
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
