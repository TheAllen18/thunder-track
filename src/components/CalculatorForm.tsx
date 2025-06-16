
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChargerType, CalculationInput } from '@/utils/calculatorUtils';

interface CalculatorFormProps {
  onCalculate: (input: CalculationInput) => void;
  chargerType: 'AC' | 'DC';
  acChargers: ChargerType[];
  dcChargers: ChargerType[];
  hideACChargers?: boolean;
}

const CalculatorForm = ({ onCalculate, chargerType, acChargers, dcChargers, hideACChargers = false }: CalculatorFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  
  const [selectedCharger, setSelectedCharger] = useState<ChargerType | null>(null);
  const [chargerCount, setChargerCount] = useState(1);
  const [utilizationRate, setUtilizationRate] = useState(30);
  const [electricityRate, setElectricityRate] = useState(8);

  const watchedChargerType = chargerType;
  const currentChargers = watchedChargerType === 'AC' ? acChargers : dcChargers;

  useEffect(() => {
    if (currentChargers.length > 0) {
      setSelectedCharger(currentChargers[0]);
    }
  }, [currentChargers]);

  const onSubmit = (data: any) => {
    if (!selectedCharger) return;

    const input: CalculationInput = {
      charger: selectedCharger,
      chargerCount: chargerCount,
      utilizationRate: utilizationRate,
      electricityRate: electricityRate,
      civilWorkCost: data.civilWorkCost || 0,
      // Required properties with defaults
      batterySize: 50, // Default battery size
      electricityCost: electricityRate,
      timeHorizon: 5, // Default 5 years
      revenuePerUnit: 18, // Default revenue per unit
      operationalCostPerUnit: 1, // Default operational cost
      miscellaneousCostPerUnit: 1, // Default miscellaneous cost
    };

    onCalculate(input);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="charger">Charger Model</Label>
          <Select onValueChange={(value) => {
            const charger = currentChargers.find(c => c.id === value);
            if (charger) setSelectedCharger(charger);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select a charger" />
            </SelectTrigger>
            <SelectContent>
              {currentChargers.map((charger) => (
                <SelectItem key={charger.id} value={charger.id}>
                  {charger.name} - {charger.power}kW
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chargerCount">Number of Chargers</Label>
          <Input
            id="chargerCount"
            type="number"
            min="1"
            max="50"
            value={chargerCount}
            onChange={(e) => setChargerCount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Utilization Rate: {utilizationRate}%</Label>
          <Slider
            value={[utilizationRate]}
            onValueChange={(value) => setUtilizationRate(value[0])}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="electricityRate">Electricity Rate (₹/kWh)</Label>
          <Input
            id="electricityRate"
            type="number"
            step="0.01"
            min="0"
            value={electricityRate}
            onChange={(e) => setElectricityRate(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="civilWorkCost">Civil Work Cost (₹)</Label>
          <Input
            id="civilWorkCost"
            type="number"
            min="0"
            {...register('civilWorkCost')}
            placeholder="0"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
        Calculate ROI
      </Button>
    </form>
  );
};

export default CalculatorForm;
