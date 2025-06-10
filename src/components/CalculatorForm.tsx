
import React, { useState, useEffect } from 'react';
import { 
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
import { ArrowRight } from 'lucide-react';
import { useForm } from "react-hook-form";

interface CalculatorFormProps {
  onCalculate: (input: CalculationInput) => void;
  chargerType: 'AC' | 'DC';
  acChargers: ChargerType[];
  dcChargers: ChargerType[];
  hideACChargers?: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ 
  onCalculate, 
  chargerType, 
  acChargers, 
  dcChargers,
  hideACChargers = false
}) => {
  const [selectedChargerId, setSelectedChargerId] = useState<string>("");
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);
  const [usePublicChargingComparison, setUsePublicChargingComparison] = useState<boolean>(false);
  const [timeHorizon, setTimeHorizon] = useState<number>(3);
  
  // AC specific fields
  const [dailyKilometers, setDailyKilometers] = useState<number>(50);
  const [batterySize, setBatterySize] = useState<number>(3.5);
  const [chargingFrequency, setChargingFrequency] = useState<number>(3);
  
  // DC specific fields
  const [dailyOperatingHours, setDailyOperatingHours] = useState<number>(3);
  
  // Common fields
  const [electricityCost, setElectricityCost] = useState<number>(8);
  const [revenuePerUnit, setRevenuePerUnit] = useState<number>(18);
  const [operationalCostPerUnit, setOperationalCostPerUnit] = useState<number>(1);
  const [miscellaneousCostPerUnit, setMiscellaneousCostPerUnit] = useState<number>(1);
  
  // AC specific fields
  const [fuelCost, setFuelCost] = useState<number>(100);
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(15);
  const [publicChargingCost, setPublicChargingCost] = useState<number>(18);

  // Reset selected charger when charger type changes
  useEffect(() => {
    const defaultChargerId = (hideACChargers || chargerType === 'DC') ? dcChargers[0].id : acChargers[0].id;
    setSelectedChargerId(defaultChargerId);
  }, [chargerType, acChargers, dcChargers, hideACChargers]);

  const chargers = (hideACChargers || chargerType === 'DC') ? dcChargers : acChargers;
  const selectedCharger = chargers.find(c => c.id === selectedChargerId) || chargers[0];

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  const handleCalculate = () => {
    const baseInput: CalculationInput = {
      charger: selectedCharger,
      chargerCount,
      civilWorkCost: 0,
      electricityCost,
      revenuePerUnit,
      timeHorizon,
      batterySize,
      operationalCostPerUnit,
      miscellaneousCostPerUnit
    };

    let input: CalculationInput;
    
    if (!hideACChargers && chargerType === 'AC') {
      input = {
        ...baseInput,
        dailyKilometers,
        batterySize,
        chargingFrequency,
        fuelCost,
        fuelEfficiency,
        publicChargingCost,
        usePublicChargingComparison
      };
    } else {
      input = {
        ...baseInput,
        dailyOperatingHours,
        averageCustomersPerDay: 10 // Default value since field is removed
      };
    }

    onCalculate(input);
  };

  const form = useForm({
    defaultValues: {
      daily_kilometers: dailyKilometers,
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
        <h3 className="font-medium text-lg mb-3 font-poppins text-gray-800">Vehicle & Usage Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="daily-kilometers" className="text-gray-700">Avg. Kilometres Per Day</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="daily-kilometers"
                className="ev-input bg-white border-gray-300 text-gray-800"
                value={dailyKilometers}
                onChange={(e) => setDailyKilometers(Number(e.target.value))}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <span className="text-sm text-gray-600">km</span>
            </div>
          </div>

          <div>
            <Label htmlFor="battery-size" className="text-gray-700">Battery Size</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="battery-size"
                className="ev-input bg-white border-gray-300 text-gray-800"
                value={batterySize}
                onChange={(e) => setBatterySize(Number(e.target.value))}
                step="0.1"
                min="1"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <span className="text-sm text-gray-600">kWh</span>
            </div>
          </div>

          <div>
            <Label htmlFor="charging-frequency" className="text-gray-700">Charging Frequency (days per week)</Label>
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
              <div className="flex justify-between mt-1 text-sm text-gray-600">
                <span>1 day</span>
                <span>{chargingFrequency} days</span>
                <span>7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-gray-800">Energy & Cost Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="electricity-cost" className="text-gray-700">Home Electricity Tariff (₹/kWh)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="electricity-cost"
                className="ev-input bg-white border-gray-300 text-gray-800"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                step="0.1"
                min="1"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <span className="text-sm text-gray-600">₹/kWh</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="comparison-type" className="text-gray-700">Compare With Public EV Charging</Label>
            <Switch
              id="comparison-type"
              checked={usePublicChargingComparison}
              onCheckedChange={setUsePublicChargingComparison}
              className="bg-gray-300 data-[state=checked]:bg-primary"
            />
          </div>

          {usePublicChargingComparison ? (
            <div>
              <Label htmlFor="public-charging-cost" className="text-gray-700">Public Charging Cost</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="public-charging-cost"
                  className="ev-input bg-white border-gray-300 text-gray-800"
                  value={publicChargingCost}
                  onChange={(e) => setPublicChargingCost(Number(e.target.value))}
                  step="0.1"
                  min="1"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <span className="text-sm text-gray-600">₹/kWh</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fuel-cost" className="text-gray-700">Fuel Cost (Petrol/Diesel)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    id="fuel-cost"
                    className="ev-input bg-white border-gray-300 text-gray-800"
                    value={fuelCost}
                    onChange={(e) => setFuelCost(Number(e.target.value))}
                    step="0.1"
                    min="1"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <span className="text-sm text-gray-600">₹/liter</span>
                </div>
              </div>

              <div>
                <Label htmlFor="fuel-efficiency" className="text-gray-700">Vehicle Mileage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    id="fuel-efficiency"
                    className="ev-input bg-white border-gray-300 text-gray-800"
                    value={fuelEfficiency}
                    onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                    step="0.1"
                    min="1"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <span className="text-sm text-gray-600">km/liter</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderDCFields = () => (
    <>
      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-gray-800">Usage Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="daily-operating-hours" className="text-gray-700">Daily Operating Hours</Label>
            <Select
              value={dailyOperatingHours.toString()}
              onValueChange={(value) => setDailyOperatingHours(Number(value))}
            >
              <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-800 rounded-md">
                <SelectValue placeholder="Select operating hours" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 text-gray-800">
                {hoursOptions.map(hour => (
                  <SelectItem key={hour} value={hour.toString()} className="text-gray-800 hover:bg-gray-100">
                    {hour} {hour === 1 ? 'hour' : 'hours'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3 font-poppins text-gray-800">Revenue & Cost Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="revenue-per-unit" className="text-gray-700">Revenue Per Unit</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="revenue-per-unit"
                className="ev-input bg-white border-gray-300 text-gray-800"
                value={revenuePerUnit}
                onChange={(e) => setRevenuePerUnit(Number(e.target.value))}
                step="0.1"
                min="1"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <span className="text-sm text-gray-600">₹/unit</span>
            </div>
          </div>

          <div>
            <Label htmlFor="electricity-cost-dc" className="text-gray-700">Electricity Cost</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="electricity-cost-dc"
                className="ev-input bg-white border-gray-300 text-gray-800"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                step="0.1"
                min="1"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <span className="text-sm text-gray-600">₹/unit</span>
            </div>
          </div>

          <div className="p-3 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center">
              <Label htmlFor="operational-cost" className="text-gray-700">Operational Cost Per Unit</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="operational-cost"
                  className="ev-input bg-white border-gray-300 text-gray-800 w-24"
                  value={operationalCostPerUnit}
                  onChange={(e) => setOperationalCostPerUnit(Number(e.target.value))}
                  step="0.1"
                  min="0"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <span className="text-sm text-gray-600">₹</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <Label htmlFor="miscellaneous-cost" className="text-gray-700">Miscellaneous Cost Per Unit</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="miscellaneous-cost"
                  className="ev-input bg-white border-gray-300 text-gray-800 w-24"
                  value={miscellaneousCostPerUnit}
                  onChange={(e) => setMiscellaneousCostPerUnit(Number(e.target.value))}
                  step="0.1"
                  min="0"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <span className="text-sm text-gray-600">₹</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl">
      <div className="bg-premium-gradient text-white p-6 rounded-t-xl">
        <h2 className="text-xl flex items-center gap-2 font-poppins font-medium">
          Thunder Track DC ROI Calculator
        </h2>
        <p className="text-gray-100 text-sm mt-1">
          Calculate the return on investment and savings for your DC charging station
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-3 font-poppins text-gray-800">Choose Your Charger</h3>
            
            <div>
              <Label htmlFor="charger-type" className="text-gray-700">
                Charger Type
              </Label>
              <Select
                value={selectedChargerId}
                onValueChange={setSelectedChargerId}
              >
                <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-800 rounded-md mt-1">
                  <SelectValue placeholder="Select a charger type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 text-gray-800">
                  {chargers.map((charger) => (
                    <SelectItem key={charger.id} value={charger.id} className="text-gray-800 hover:bg-gray-100">
                      {charger.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label htmlFor="charger-count" className="text-gray-700">Number of Chargers</Label>
              <div className="flex items-center gap-4 mt-1">
                <Input
                  type="number"
                  id="charger-count"
                  className="bg-white border-gray-300 text-gray-800 rounded-md flex-1"
                  min={1}
                  max={10}
                  value={chargerCount}
                  onChange={(e) => setChargerCount(Number(e.target.value))}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setChargerCount(Math.max(1, chargerCount - 1))}
                    className="border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  >
                    -
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setChargerCount(chargerCount + 1)}
                    className="border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {!hideACChargers && chargerType === 'AC' ? renderACFields() : renderDCFields()}

          <div>
            <Label htmlFor="time-horizon" className="text-gray-700">Time Horizon for ROI Analysis</Label>
            <div className="mt-2">
              <Slider
                id="time-horizon"
                min={1}
                max={7}
                step={1}
                value={[timeHorizon]}
                onValueChange={(values) => setTimeHorizon(values[0])}
                className="mt-2"
              />
              <div className="flex justify-between mt-1 text-sm text-gray-600">
                <span>1 year</span>
                <span>{timeHorizon} years</span>
                <span>7 years</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            className="w-full bg-premium-gradient hover:opacity-90 text-white flex items-center justify-center"
          >
            Calculate ROI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;
