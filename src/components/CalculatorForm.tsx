
import React, { useState } from 'react';
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
import { chargerTypes, ChargerType, CalculationInput } from '@/utils/calculatorUtils';
import { Info, ArrowRight } from 'lucide-react';
import { useForm } from "react-hook-form";

interface CalculatorFormProps {
  onCalculate: (input: CalculationInput) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
  const [selectedChargerId, setSelectedChargerId] = useState<string>(chargerTypes[0].id);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [civilWorkNeeded, setCivilWorkNeeded] = useState<boolean>(false);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);
  const [inputType, setInputType] = useState<'efficiency' | 'battery'>('efficiency');
  const [isCommercialProperty, setIsCommercialProperty] = useState<boolean>(false);
  const [timeHorizon, setTimeHorizon] = useState<number>(3); // default 3 years
  
  const [dailyKilometers, setDailyKilometers] = useState<number>(50);
  const [carEfficiency, setCarEfficiency] = useState<number>(5); // km/kWh
  const [batterySize, setBatterySize] = useState<number>(40); // kWh
  const [chargingFrequency, setChargingFrequency] = useState<number>(3); // days per week
  const [electricityCost, setElectricityCost] = useState<number>(8); // ₹/kWh
  const [fuelCost, setFuelCost] = useState<number>(100); // ₹/liter
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(15); // km/l

  const selectedCharger = chargerTypes.find(c => c.id === selectedChargerId) || chargerTypes[0];

  const handleCalculate = () => {
    // Use carEfficiency directly or derive from battery size depending on input type
    const actualEfficiency = inputType === 'efficiency' ? 
      carEfficiency : 
      dailyKilometers / batterySize;

    const input: CalculationInput = {
      charger: selectedCharger,
      chargerCount,
      civilWorkCost: civilWorkNeeded ? civilWorkCost : 0,
      dailyKilometers,
      carEfficiency: actualEfficiency,
      batterySize: inputType === 'battery' ? batterySize : undefined,
      chargingFrequency,
      electricityCost,
      isCommercialProperty,
      fuelCost,
      fuelEfficiency,
      timeHorizon
    };

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

  return (
    <Card className="ev-card">
      <CardHeader className="ev-card-header">
        <CardTitle className="flex items-center gap-2">
          EV Charger ROI Calculator
        </CardTitle>
        <CardDescription className="text-gray-100">
          Calculate the return on investment and savings for your EV charging station
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-3">Charger Selection</h3>
            
            <div>
              <Label htmlFor="charger-type" className="flex items-center gap-1">
                Charger Type <Info size={16} className="cursor-help" />
              </Label>
              <Select
                value={selectedChargerId}
                onValueChange={setSelectedChargerId}
              >
                <SelectTrigger className="w-full ev-input mt-1">
                  <SelectValue placeholder="Select a charger type" />
                </SelectTrigger>
                <SelectContent>
                  {chargerTypes.map((charger) => (
                    <SelectItem key={charger.id} value={charger.id}>
                      {charger.name} ({charger.phase} Phase - {charger.power}kW) - ₹{charger.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="charger-count">Number of Chargers</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Input
                    type="number"
                    id="charger-count"
                    className="ev-input flex-1"
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
                    >
                      -
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setChargerCount(chargerCount + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="civil-work-needed">Civil Work Needed</Label>
                  <Switch
                    id="civil-work-needed"
                    checked={civilWorkNeeded}
                    onCheckedChange={setCivilWorkNeeded}
                  />
                </div>
                
                {civilWorkNeeded && (
                  <Input
                    type="number"
                    id="civil-work-cost"
                    className="ev-input mt-1"
                    placeholder="Enter civil work cost"
                    value={civilWorkCost}
                    onChange={(e) => setCivilWorkCost(Number(e.target.value))}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Vehicle & Usage Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="daily-kilometers">Daily Kilometers Driven</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    id="daily-kilometers"
                    className="ev-input"
                    value={dailyKilometers}
                    onChange={(e) => setDailyKilometers(Number(e.target.value))}
                  />
                  <span className="text-sm text-gray-500">km</span>
                </div>
              </div>

              <div className="space-y-2">
                <Tabs defaultValue="efficiency" onValueChange={(v) => setInputType(v as 'efficiency' | 'battery')}>
                  <div className="flex justify-between items-center">
                    <Label>Car Energy Efficiency</Label>
                    <TabsList className="grid grid-cols-2 w-[200px]">
                      <TabsTrigger value="efficiency">km/kWh</TabsTrigger>
                      <TabsTrigger value="battery">Battery Size</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="efficiency">
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        id="car-efficiency"
                        className="ev-input"
                        value={carEfficiency}
                        onChange={(e) => setCarEfficiency(Number(e.target.value))}
                        step="0.1"
                        min="1"
                      />
                      <span className="text-sm text-gray-500">km/kWh</span>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="battery">
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        id="battery-size"
                        className="ev-input"
                        value={batterySize}
                        onChange={(e) => setBatterySize(Number(e.target.value))}
                        step="1"
                        min="10"
                      />
                      <span className="text-sm text-gray-500">kWh</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Label htmlFor="charging-frequency">Charging Frequency (days per week)</Label>
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
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>1 day</span>
                    <span>{chargingFrequency} days</span>
                    <span>7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3">Energy & Fuel Costs</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="property-type">Commercial Property</Label>
                  <Switch
                    id="property-type"
                    checked={isCommercialProperty}
                    onCheckedChange={setIsCommercialProperty}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    id="electricity-cost"
                    className="ev-input"
                    value={electricityCost}
                    onChange={(e) => setElectricityCost(Number(e.target.value))}
                    step="0.1"
                    min="1"
                  />
                  <span className="text-sm text-gray-500">₹/kWh</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isCommercialProperty ? 'Commercial electricity rates' : 'Residential electricity rates'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuel-cost">Fuel Cost (Petrol/Diesel)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      id="fuel-cost"
                      className="ev-input"
                      value={fuelCost}
                      onChange={(e) => setFuelCost(Number(e.target.value))}
                      step="0.1"
                      min="1"
                    />
                    <span className="text-sm text-gray-500">₹/liter</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fuel-efficiency">Fuel Vehicle Efficiency</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      id="fuel-efficiency"
                      className="ev-input"
                      value={fuelEfficiency}
                      onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                      step="0.1"
                      min="1"
                    />
                    <span className="text-sm text-gray-500">km/liter</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="time-horizon">Time Horizon for ROI Analysis</Label>
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
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>1 year</span>
                <span>3 years</span>
                <span>5 years</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            className="w-full bg-evgreen hover:bg-evgreen-dark flex items-center justify-center gap-2"
          >
            Calculate ROI <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
