
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
import { chargerTypes, ChargerType } from '@/utils/calculatorUtils';
import { Info } from 'lucide-react';

interface CalculatorFormProps {
  onCalculate: (
    charger: ChargerType,
    chargerCount: number,
    revenuePerUnit: number,
    expenditurePerUnit: number,
    operationalCostPerUnit: number,
    miscellaneousCostPerUnit: number,
    daysPerMonth: number,
    civilWorkCost: number
  ) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
  const [selectedChargerId, setSelectedChargerId] = useState<string>(chargerTypes[0].id);
  const [chargerCount, setChargerCount] = useState<number>(1);
  const [revenuePerUnit, setRevenuePerUnit] = useState<number>(18);
  const [expenditurePerUnit, setExpenditurePerUnit] = useState<number>(8);
  const [operationalCostPerUnit, setOperationalCostPerUnit] = useState<number>(1);
  const [miscellaneousCostPerUnit, setMiscellaneousCostPerUnit] = useState<number>(1);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(30);
  const [civilWorkCost, setCivilWorkCost] = useState<number>(0);

  const selectedCharger = chargerTypes.find(c => c.id === selectedChargerId) || chargerTypes[0];

  const handleCalculate = () => {
    onCalculate(
      selectedCharger,
      chargerCount,
      revenuePerUnit,
      expenditurePerUnit,
      operationalCostPerUnit,
      miscellaneousCostPerUnit,
      daysPerMonth,
      civilWorkCost
    );
  };

  return (
    <Card className="ev-card">
      <CardHeader className="ev-card-header">
        <CardTitle className="flex items-center gap-2">
          EV Charger ROI Calculator
        </CardTitle>
        <CardDescription className="text-gray-100">
          Calculate the return on investment for your EV charging station
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="civil-work">Civil Work Cost (Optional)</Label>
              <Input
                type="number"
                id="civil-work"
                className="ev-input mt-1"
                placeholder="₹0"
                value={civilWorkCost}
                onChange={(e) => setCivilWorkCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-6 py-2">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="revenue-per-unit">Revenue per Unit (₹)</Label>
                <span className="text-evgreen font-medium">₹{revenuePerUnit}</span>
              </div>
              <Slider
                id="revenue-per-unit"
                min={10}
                max={30}
                step={0.5}
                value={[revenuePerUnit]}
                onValueChange={(values) => setRevenuePerUnit(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="expenditure-per-unit">Electricity Cost per Unit (₹)</Label>
                <span className="text-evgreen font-medium">₹{expenditurePerUnit}</span>
              </div>
              <Slider
                id="expenditure-per-unit"
                min={5}
                max={15}
                step={0.5}
                value={[expenditurePerUnit]}
                onValueChange={(values) => setExpenditurePerUnit(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="operational-cost">Operational Cost per Unit (₹)</Label>
                <span className="text-evgreen font-medium">₹{operationalCostPerUnit}</span>
              </div>
              <Slider
                id="operational-cost"
                min={0.5}
                max={5}
                step={0.5}
                value={[operationalCostPerUnit]}
                onValueChange={(values) => setOperationalCostPerUnit(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="miscellaneous-cost">Miscellaneous Cost per Unit (₹)</Label>
                <span className="text-evgreen font-medium">₹{miscellaneousCostPerUnit}</span>
              </div>
              <Slider
                id="miscellaneous-cost"
                min={0.5}
                max={5}
                step={0.5}
                value={[miscellaneousCostPerUnit]}
                onValueChange={(values) => setMiscellaneousCostPerUnit(values[0])}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="days-per-month">Active Days per Month</Label>
                <span className="text-evgreen font-medium">{daysPerMonth} days</span>
              </div>
              <Slider
                id="days-per-month"
                min={20}
                max={31}
                step={1}
                value={[daysPerMonth]}
                onValueChange={(values) => setDaysPerMonth(values[0])}
                className="mt-2"
              />
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            className="w-full bg-evgreen hover:bg-evgreen-dark"
          >
            Calculate ROI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
