
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChargerType, CalculationInput } from '@/utils/calculatorUtils';
import { Info, ArrowRight } from 'lucide-react';
import { useForm } from "react-hook-form";

interface CalculatorFormProps {
  onCalculate: (input: CalculationInput) => void;
  chargerType: 'AC' | 'DC';
  acChargers: ChargerType[];
  dcChargers: ChargerType[];
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ 
  onCalculate, 
  chargerType, 
  acChargers, 
  dcChargers 
}) => {
  const [selectedChargerId, setSelectedChargerId] = useState<string>("");
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkNeeded, setCivilWorkNeeded] = useState<boolean>(false);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);
  const [inputType, setInputType] = useState<'efficiency' | 'battery'>('efficiency');
  const [isCommercialProperty, setIsCommercialProperty] = useState<boolean>(false);
  const [timeHorizon, setTimeHorizon] = useState<number>(3); // default 3 years
  
  // AC specific fields
  const [dailyKilometers, setDailyKilometers] = useState<number>(50);
  const [carEfficiency, setCarEfficiency] = useState<number>(5); // km/kWh
  const [batterySize, setBatterySize] = useState<number>(40); // kWh
  const [chargingFrequency, setChargingFrequency] = useState<number>(3); // days per week
  
  // DC specific fields
  const [dailyOperatingHours, setDailyOperatingHours] = useState<number>(3);
  const [averageCustomersPerDay, setAverageCustomersPerDay] = useState<number>(10);
  
  // Common fields
  const [electricityCost, setElectricityCost] = useState<number>(8); // ₹/kWh
  const [revenuePerUnit, setRevenuePerUnit] = useState<number>(18); // ₹/unit
  
  // AC specific fields
  const [fuelCost, setFuelCost] = useState<number>(100); // ₹/liter
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(15); // km/l

  // Reset selected charger when charger type changes
  useEffect(() => {
    const defaultChargerId = chargerType === 'AC' ? acChargers[0].id : dcChargers[0].id;
    setSelectedChargerId(defaultChargerId);
  }, [chargerType, acChargers, dcChargers]);

  const chargers = chargerType === 'AC' ? acChargers : dcChargers;
  const selectedCharger = chargers.find(c => c.id === selectedChargerId) || chargers[0];

  const handleCalculate = () => {
    // Common input fields
    const baseInput: CalculationInput = {
      charger: selectedCharger,
      chargerCount,
      civilWorkCost: civilWorkNeeded ? civilWorkCost : 0,
      electricityCost,
      revenuePerUnit,
      timeHorizon
    };

    // Add type-specific fields
    let input: CalculationInput;
    
    if (chargerType === 'AC') {
      // Use carEfficiency directly or derive from battery size depending on input type
      const actualEfficiency = inputType === 'efficiency' ? 
        carEfficiency : 
        dailyKilometers / batterySize;

      input = {
        ...baseInput,
        dailyKilometers,
        carEfficiency: actualEfficiency,
        batterySize: inputType === 'battery' ? batterySize : undefined,
        chargingFrequency,
        isCommercialProperty,
        fuelCost,
        fuelEfficiency
      };
    } else {
      input = {
        ...baseInput,
        dailyOperatingHours,
        averageCustomersPerDay
      };
    }

    onCalculate(input);
  };

  const form = useForm({
    defaultValues: {
      daily_kilometers: dailyKilometers,
      car_efficiency: carEfficiency,
      battery_size: batterySize,
      charging_frequency: chargingFrequency,
      electricity_cost: electricityCost,
      fuel_cost: fuelCost,
      fuel_efficiency: fuelEfficiency,
    }
  });

  const renderACFields = () => (
    <>
      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-white">Vehicle & Usage Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="daily-kilometers" className="text-zinc-300">Daily Kilometers Driven</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="daily-kilometers"
                className="ev-input bg-zinc-800 border-zinc-700 text-white"
                value={dailyKilometers}
                onChange={(e) => setDailyKilometers(Number(e.target.value))}
              />
              <span className="text-sm text-zinc-400">km</span>
            </div>
          </div>

          <div className="space-y-2">
            <Tabs defaultValue="efficiency" onValueChange={(v) => setInputType(v as 'efficiency' | 'battery')}>
              <div className="flex justify-between items-center">
                <Label className="text-zinc-300">Car Energy Efficiency</Label>
                <TabsList className="grid grid-cols-2 w-[200px] bg-zinc-800">
                  <TabsTrigger value="efficiency" className="data-[state=active]:bg-premium-gradient">km/kWh</TabsTrigger>
                  <TabsTrigger value="battery" className="data-[state=active]:bg-premium-gradient">Battery Size</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="efficiency">
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    id="car-efficiency"
                    className="ev-input bg-zinc-800 border-zinc-700 text-white"
                    value={carEfficiency}
                    onChange={(e) => setCarEfficiency(Number(e.target.value))}
                    step="0.1"
                    min="1"
                  />
                  <span className="text-sm text-zinc-400">km/kWh</span>
                </div>
              </TabsContent>
              
              <TabsContent value="battery">
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    id="battery-size"
                    className="ev-input bg-zinc-800 border-zinc-700 text-white"
                    value={batterySize}
                    onChange={(e) => setBatterySize(Number(e.target.value))}
                    step="1"
                    min="10"
                  />
                  <span className="text-sm text-zinc-400">kWh</span>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="charging-frequency" className="text-zinc-300">Charging Frequency (days per week)</Label>
            <div className="mt-2">
              <Slider
                id="charging-frequency"
                min={1}
                max={7}
                step={1}
                value={[chargingFrequency]}
                onValueChange={(values) => setChargingFrequency(values[0])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1 text-sm text-zinc-400">
                <span>1 day</span>
                <span>{chargingFrequency} days</span>
                <span>7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-white">Energy & Fuel Costs</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="property-type" className="text-zinc-300">Commercial Property</Label>
              <Switch
                id="property-type"
                checked={isCommercialProperty}
                onCheckedChange={setIsCommercialProperty}
                className="bg-zinc-700 data-[state=checked]:bg-premium-gradient"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="electricity-cost"
                className="ev-input bg-zinc-800 border-zinc-700 text-white"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                step="0.1"
                min="1"
              />
              <span className="text-sm text-zinc-400">₹/kWh</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {isCommercialProperty ? 'Commercial electricity rates' : 'Residential electricity rates'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuel-cost" className="text-zinc-300">Fuel Cost (Petrol/Diesel)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="fuel-cost"
                  className="ev-input bg-zinc-800 border-zinc-700 text-white"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(Number(e.target.value))}
                  step="0.1"
                  min="1"
                />
                <span className="text-sm text-zinc-400">₹/liter</span>
              </div>
            </div>

            <div>
              <Label htmlFor="fuel-efficiency" className="text-zinc-300">Fuel Vehicle Efficiency</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="fuel-efficiency"
                  className="ev-input bg-zinc-800 border-zinc-700 text-white"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                  step="0.1"
                  min="1"
                />
                <span className="text-sm text-zinc-400">km/liter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDCFields = () => (
    <>
      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-white">Usage Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="daily-operating-hours" className="text-zinc-300">Daily Operating Hours</Label>
            <div className="mt-2">
              <Slider
                id="daily-operating-hours"
                min={1}
                max={5}
                step={1}
                value={[dailyOperatingHours]}
                onValueChange={(values) => setDailyOperatingHours(values[0])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1 text-sm text-zinc-400">
                <span>1 hour</span>
                <span>{dailyOperatingHours} hours</span>
                <span>5 hours</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="average-customers" className="text-zinc-300">Average Customers Per Day</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="average-customers"
                className="ev-input bg-zinc-800 border-zinc-700 text-white"
                value={averageCustomersPerDay}
                onChange={(e) => setAverageCustomersPerDay(Math.max(1, Number(e.target.value)))}
                min="1"
              />
              <span className="text-sm text-zinc-400">customers</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-white">Revenue & Cost Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="revenue-per-unit" className="text-zinc-300">Revenue Per Unit</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="revenue-per-unit"
                className="ev-input bg-zinc-800 border-zinc-700 text-white"
                value={revenuePerUnit}
                onChange={(e) => setRevenuePerUnit(Number(e.target.value))}
                step="0.1"
                min="1"
              />
              <span className="text-sm text-zinc-400">₹/unit</span>
            </div>
          </div>

          <div>
            <Label htmlFor="electricity-cost-dc" className="text-zinc-300">Electricity Cost</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="electricity-cost-dc"
                className="ev-input bg-zinc-800 border-zinc-700 text-white"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                step="0.1"
                min="1"
              />
              <span className="text-sm text-zinc-400">₹/unit</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-800/70 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-300">Operational Cost Per Unit</span>
              <span className="text-sm text-zinc-300">₹1.00</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-zinc-300">Miscellaneous Cost Per Unit</span>
              <span className="text-sm text-zinc-300">₹1.00</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">*These values are fixed and non-editable</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Card className="bg-zinc-800 shadow-lg border border-zinc-700">
      <CardHeader className="bg-premium-gradient text-white">
        <CardTitle className="flex items-center gap-2 font-poppins">
          Thunder Plus {chargerType} ROI Calculator
        </CardTitle>
        <CardDescription className="text-gray-100">
          Calculate the return on investment and savings for your {chargerType} charging station
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-3 font-poppins text-white">Charger Selection</h3>
            
            <div>
              <Label htmlFor="charger-type" className="flex items-center gap-1 text-zinc-300">
                Charger Type <Info size={16} className="cursor-help" />
              </Label>
              <Select
                value={selectedChargerId}
                onValueChange={setSelectedChargerId}
              >
                <SelectTrigger className="w-full border border-zinc-700 bg-zinc-800 text-white rounded-md mt-1">
                  <SelectValue placeholder="Select a charger type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  {chargers.map((charger) => (
                    <SelectItem key={charger.id} value={charger.id} className="text-white hover:bg-zinc-700">
                      {charger.name} ({charger.phase} Phase - {charger.power}kW) - {charger.warranty} Warranty
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="charger-count" className="text-zinc-300">Number of Chargers</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Input
                    type="number"
                    id="charger-count"
                    className="bg-zinc-800 border-zinc-700 text-white rounded-md flex-1"
                    min={1}
                    max={10}
                    value={chargerCount}
                    onChange={(e) => setChargerCount(Number(e.target.value))}
                  />
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setChargerCount(Math.max(1, chargerCount - 1))}
                      className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                    >
                      -
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setChargerCount(chargerCount + 1)}
                      className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="civil-work-needed" className="text-zinc-300">Civil Work Needed</Label>
                  <Switch
                    id="civil-work-needed"
                    checked={civilWorkNeeded}
                    onCheckedChange={setCivilWorkNeeded}
                    className="bg-zinc-700 data-[state=checked]:bg-premium-gradient"
                  />
                </div>
                
                {civilWorkNeeded && (
                  <Input
                    type="number"
                    id="civil-work-cost"
                    className="bg-zinc-800 border-zinc-700 text-white rounded-md mt-1"
                    placeholder="Enter civil work cost"
                    value={civilWorkCost}
                    onChange={(e) => setCivilWorkCost(Number(e.target.value))}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Render fields based on charger type */}
          {chargerType === 'AC' ? renderACFields() : renderDCFields()}

          <div>
            <Label htmlFor="time-horizon" className="text-zinc-300">Time Horizon for ROI Analysis</Label>
            <div className="mt-2">
              <Slider
                id="time-horizon"
                min={1}
                max={5}
                step={1}
                value={[timeHorizon]}
                onValueChange={(values) => setTimeHorizon(values[0])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1 text-sm text-zinc-400">
                <span>1 year</span>
                <span>3 years</span>
                <span>5 years</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            className="w-full bg-premium-gradient hover:opacity-90 text-white flex items-center justify-center gap-2"
          >
            Calculate ROI <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
