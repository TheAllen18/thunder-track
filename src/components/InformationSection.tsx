
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface InformationSectionProps {
  chargerType: 'AC' | 'DC';
}

const InformationSection: React.FC<InformationSectionProps> = ({ chargerType }) => {
  return (
    <div className="mt-12 mb-8" id="about">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 font-poppins">
        Understanding the {chargerType} ROI Calculator
      </h2>

      <div className="space-y-6 text-gray-700">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 font-poppins">How the Calculator Works</h3>
            
            {chargerType === 'AC' ? (
              <div className="space-y-4">
                <p>
                  The AC charging ROI calculator helps you understand the financial benefits of 
                  installing a Thunder AC charger compared to using conventional fuel or public EV charging.
                </p>
                
                <h4 className="font-semibold mt-4">Key Calculations</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Energy Requirements:</strong> Based on your daily kilometers driven and 
                    battery size, we calculate how much energy you need each day.
                  </li>
                  <li>
                    <strong>Charging Time:</strong> We calculate how long it takes to charge both your 
                    daily energy needs and a full battery (0-100%) based on your selected charger power.
                  </li>
                  <li>
                    <strong>Monthly Costs:</strong> We compare your home charging costs against either fuel 
                    costs or public charging costs depending on your selection.
                  </li>
                  <li>
                    <strong>Savings:</strong> By comparing costs, we calculate your monthly and yearly savings.
                  </li>
                  <li>
                    <strong>Break-even Point:</strong> We determine how long it will take for your savings to 
                    cover your initial investment.
                  </li>
                  <li>
                    <strong>ROI Percentage:</strong> We calculate your annualized return on investment as a 
                    percentage to help you understand the value of your purchase.
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  The DC charging ROI calculator helps you understand the financial returns of 
                  installing Thunder DC fast charging stations as a business investment.
                </p>
                
                <h4 className="font-semibold mt-4">Key Calculations</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Energy Delivery:</strong> Based on daily operating hours and average customers, 
                    we calculate your station's energy delivery capacity.
                  </li>
                  <li>
                    <strong>Revenue:</strong> We calculate potential revenue based on your pricing per unit (kWh).
                  </li>
                  <li>
                    <strong>Costs:</strong> We factor in electricity costs, operational costs, and miscellaneous expenses.
                  </li>
                  <li>
                    <strong>Profitability:</strong> We calculate monthly and yearly net profit potential.
                  </li>
                  <li>
                    <strong>Break-even:</strong> We determine how long it will take to recover your investment.
                  </li>
                  <li>
                    <strong>Long-term Returns:</strong> We project profits over your selected time horizon.
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 font-poppins">
              Our {chargerType} Charger Lineup
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {chargerType === 'AC' ? (
                <>
                  <div className="premium-card p-4 rounded-xl">
                    <div className="premium-gradient rounded-lg p-3 text-white">
                      <h4 className="font-semibold">Thunder Lite</h4>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm">3.3 kW single-phase charger</p>
                      <p className="text-sm mt-1">Perfect for overnight home charging</p>
                      <p className="font-semibold mt-2">₹15,000</p>
                    </div>
                  </div>
                  
                  <div className="premium-card p-4 rounded-xl">
                    <div className="premium-gradient rounded-lg p-3 text-white">
                      <h4 className="font-semibold">Thunder Smart</h4>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm">7.4 kW single-phase charger</p>
                      <p className="text-sm mt-1">Ideal for homes and small businesses</p>
                      <p className="font-semibold mt-2">₹45,000</p>
                    </div>
                  </div>
                  
                  <div className="premium-card p-4 rounded-xl">
                    <div className="premium-gradient rounded-lg p-3 text-white">
                      <h4 className="font-semibold">Thunder Blaze</h4>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm">22 kW three-phase charger</p>
                      <p className="text-sm mt-1">Advanced solution for businesses</p>
                      <p className="font-semibold mt-2">₹65,000</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="premium-card p-4 rounded-xl">
                    <div className="premium-gradient rounded-lg p-3 text-white">
                      <h4 className="font-semibold">Thunder Swift</h4>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm">30 kW DC fast charger</p>
                      <p className="text-sm mt-1">Entry-level DC solution</p>
                      <p className="font-semibold mt-2">₹6,00,000</p>
                    </div>
                  </div>
                  
                  <div className="premium-card p-4 rounded-xl">
                    <div className="premium-gradient rounded-lg p-3 text-white">
                      <h4 className="font-semibold">Thunder Falcon</h4>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm">60 kW DC fast charger</p>
                      <p className="text-sm mt-1">Mid-range solution for businesses</p>
                      <p className="font-semibold mt-2">₹12,00,000</p>
                    </div>
                  </div>
                  
                  <div className="premium-card p-4 rounded-xl">
                    <div className="premium-gradient rounded-lg p-3 text-white">
                      <h4 className="font-semibold">Thunder Hulk</h4>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm">120 kW DC fast charger</p>
                      <p className="text-sm mt-1">High-power charging station</p>
                      <p className="font-semibold mt-2">₹15,00,000</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {chargerType === 'DC' && (
              <div className="mt-4 flex justify-center">
                <div className="premium-card p-4 rounded-xl max-w-xs">
                  <div className="premium-gradient rounded-lg p-3 text-white">
                    <h4 className="font-semibold">Thunder Hornet</h4>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm">240 kW DC ultra-fast charger</p>
                    <p className="text-sm mt-1">Premium high-capacity solution</p>
                    <p className="font-semibold mt-2">₹32,00,000</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 font-poppins">Important Notes</h3>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Results are estimates based on provided inputs and may vary in real-world conditions.</li>
              <li>Electricity rates may vary by provider, season, and time of use.</li>
              <li>Battery performance can be affected by temperature, driving style, and battery age.</li>
              <li>Warranty is included with all charger models.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InformationSection;
