
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

interface InformationSectionProps {
  chargerType: 'AC' | 'DC';
}

const InformationSection: React.FC<InformationSectionProps> = ({ chargerType }) => {
  return (
    <div className="space-y-8 py-8">
      <Card className="ev-card" id="about">
        <CardHeader className="ev-card-header">
          <CardTitle>About EV Chargers</CardTitle>
          <CardDescription className="text-gray-100">
            Understand the different types of {chargerType} chargers we offer
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {chargerType === 'AC' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-evgreen-dark">Our AC Charger Lineup</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-gradient-to-br from-evgreen-light/10 to-evgreen/5">
                  <h4 className="font-semibold text-evgreen">3.3kW Basic AC Charger</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Single Phase</li>
                    <li>• Perfect for home use</li>
                    <li>• Affordable solution</li>
                    <li>• 1 Year Warranty</li>
                    <li>• Price: ₹15,000</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-gradient-to-br from-evgreen/10 to-evgreen-dark/5">
                  <h4 className="font-semibold text-evgreen">7.4kW Standard AC Charger</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Single Phase</li>
                    <li>• Ideal for small businesses</li>
                    <li>• Faster charging capability</li>
                    <li>• 1 Year Warranty</li>
                    <li>• Price: ₹45,000</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-gradient-to-br from-evgold/10 to-evgold-dark/5">
                  <h4 className="font-semibold text-evgold">22kW Premium AC Charger</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Three Phase</li>
                    <li>• For commercial installations</li>
                    <li>• High-speed charging</li>
                    <li>• 1 Year Warranty</li>
                    <li>• Price: ₹65,000</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-evgreen-dark">Our DC Charger Lineup</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-gradient-to-br from-evgreen-light/10 to-evgreen/5">
                  <h4 className="font-semibold text-evgreen">DC 30kWh Charger</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Three Phase</li>
                    <li>• Commercial installations</li>
                    <li>• Ultra-fast charging</li>
                    <li>• 2 Year Warranty</li>
                    <li>• Price: ₹600,000</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-gradient-to-br from-evgreen/10 to-evgreen-dark/5">
                  <h4 className="font-semibold text-evgreen">DC 60kWh Charger</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Three Phase</li>
                    <li>• Commercial establishments</li>
                    <li>• High-capacity charging</li>
                    <li>• 2 Year Warranty</li>
                    <li>• Price: ₹1,200,000</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-gradient-to-br from-evgold/10 to-evgold-dark/5">
                  <h4 className="font-semibold text-evgold">DC 120/240kWh Chargers</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Three Phase</li>
                    <li>• Enterprise-grade</li>
                    <li>• High-throughput charging</li>
                    <li>• 3 Year Warranty</li>
                    <li>• Price: ₹1,500,000+</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="ev-card">
        <CardHeader className="ev-card-header">
          <CardTitle>Understanding the ROI Calculator</CardTitle>
          <CardDescription className="text-gray-100">
            How we calculate the return on investment for your {chargerType} EV chargers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <p>
              Our calculator helps you estimate the return on investment (ROI) for installing EV charging stations. 
              Here's a breakdown of the key components:
            </p>
            
            {chargerType === 'AC' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-evgreen-dark">AC Charger Inputs</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• <span className="font-medium">Charger Type</span>: Select from our three AC charger options</li>
                    <li>• <span className="font-medium">Number of Chargers</span>: How many you plan to install</li>
                    <li>• <span className="font-medium">Civil Work Cost</span>: Additional installation expenses</li>
                    <li>• <span className="font-medium">Daily Kilometers</span>: Your typical daily driving distance</li>
                    <li>• <span className="font-medium">Battery Size</span>: Your EV's total battery capacity in kWh</li>
                    <li>• <span className="font-medium">Charging Frequency</span>: How many days per week you charge</li>
                    <li>• <span className="font-medium">Electricity Cost</span>: What you pay for electricity per kWh</li>
                    <li>• <span className="font-medium">Fuel Costs</span>: Current petrol/diesel price per liter</li>
                    <li>• <span className="font-medium">Fuel Efficiency</span>: Your conventional vehicle's km/liter</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-evgreen-dark">AC Charger Calculations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• <span className="font-medium">Daily Energy Required</span>: Energy needed based on your daily kilometers</li>
                    <li>• <span className="font-medium">Daily Charge Time</span>: Hours needed to charge your daily requirement</li>
                    <li>• <span className="font-medium">Full Charge Time</span>: Hours needed for 0-100% battery charge</li>
                    <li>• <span className="font-medium">Monthly Energy Consumption</span>: Total kWh consumed monthly</li>
                    <li>• <span className="font-medium">Monthly Charging Cost</span>: Your EV electricity cost</li>
                    <li>• <span className="font-medium">Monthly Fuel Cost</span>: What you'd spend on petrol/diesel</li>
                    <li>• <span className="font-medium">Monthly Savings</span>: Fuel Cost − Charging Cost</li>
                    <li>• <span className="font-medium">Break-even Time</span>: Total Investment ÷ Monthly Savings</li>
                    <li>• <span className="font-medium">Annualized ROI</span>: (Yearly Savings ÷ Total Investment) × 100%</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-evgreen-dark">DC Charger Inputs</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• <span className="font-medium">Charger Type</span>: Select from our DC charger options</li>
                    <li>• <span className="font-medium">Number of Chargers</span>: How many you plan to install</li>
                    <li>• <span className="font-medium">Civil Work Cost</span>: Additional installation expenses</li>
                    <li>• <span className="font-medium">Daily Operating Hours</span>: Expected hours of usage daily</li>
                    <li>• <span className="font-medium">Average Customers Per Day</span>: Expected daily customers</li>
                    <li>• <span className="font-medium">Revenue Per Unit</span>: What you charge customers per kWh</li>
                    <li>• <span className="font-medium">Electricity Cost</span>: What you pay for electricity per kWh</li>
                    <li>• <span className="font-medium">Operational Cost</span>: Fixed at ₹1 per kWh (maintenance)</li>
                    <li>• <span className="font-medium">Miscellaneous Cost</span>: Fixed at ₹1 per kWh (other costs)</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-evgreen-dark">DC Charger Calculations</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• <span className="font-medium">Daily Units Consumed</span>: Power × Hours × Customers</li>
                    <li>• <span className="font-medium">Monthly Units Consumed</span>: Daily Units × 30 days</li>
                    <li>• <span className="font-medium">Revenue</span>: Monthly Units × Revenue Per Unit</li>
                    <li>• <span className="font-medium">Expenditure</span>: Monthly Units × Electricity Cost</li>
                    <li>• <span className="font-medium">Net Revenue</span>: Revenue − (Electricity + Operational + Misc. Costs)</li>
                    <li>• <span className="font-medium">Break-even Time</span>: Total Investment ÷ Monthly Net Revenue</li>
                    <li>• <span className="font-medium">Yearly Profit</span>: Monthly Net Revenue × 12</li>
                    <li>• <span className="font-medium">5-Year Projection</span>: Profit analysis over 5 years</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
              <p className="font-medium text-yellow-800">Important Notes:</p>
              <ul className="mt-1 space-y-1 text-yellow-700">
                <li>• {chargerType === 'AC' ? 'AC chargers come with a 1-year warranty' : 'DC chargers come with 2-3 year warranty depending on model'}</li>
                <li>• Installation is included in the price (excluding civil work)</li>
                <li>• Results are estimates and actual performance may vary</li>
                <li>• The calculator provides a projection based on your inputs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationSection;
