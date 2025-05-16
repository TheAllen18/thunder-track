
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

const InformationSection: React.FC = () => {
  return (
    <div className="space-y-8 py-8">
      <Card className="ev-card" id="about">
        <CardHeader className="ev-card-header">
          <CardTitle>About EV Chargers</CardTitle>
          <CardDescription className="text-gray-100">
            Understand the different types of AC chargers we offer
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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
        </CardContent>
      </Card>

      <Card className="ev-card">
        <CardHeader className="ev-card-header">
          <CardTitle>Understanding the ROI Calculator</CardTitle>
          <CardDescription className="text-gray-100">
            How we calculate the return on investment for your EV chargers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <p>
              Our calculator helps you estimate the return on investment (ROI) for installing EV charging stations. 
              Here's a breakdown of the key components:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-evgreen-dark">Inputs</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <span className="font-medium">Charger Type</span>: Select from our three AC charger options</li>
                  <li>• <span className="font-medium">Number of Chargers</span>: How many you plan to install</li>
                  <li>• <span className="font-medium">Civil Work Cost</span>: Additional installation expenses (if any)</li>
                  <li>• <span className="font-medium">Revenue Per Unit</span>: What you charge customers per kWh</li>
                  <li>• <span className="font-medium">Electricity Cost</span>: What you pay for electricity per kWh</li>
                  <li>• <span className="font-medium">Operational Cost</span>: Maintenance and support costs per kWh</li>
                  <li>• <span className="font-medium">Miscellaneous Cost</span>: Other costs per kWh</li>
                  <li>• <span className="font-medium">Active Days</span>: Days of operation per month</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-evgreen-dark">Calculations</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <span className="font-medium">Daily Consumption</span>: Hours of usage × Charger Power</li>
                  <li>• <span className="font-medium">Monthly Consumption</span>: Daily Consumption × Active Days</li>
                  <li>• <span className="font-medium">Revenue</span>: Monthly Consumption × Revenue Per Unit</li>
                  <li>• <span className="font-medium">Electricity Cost</span>: Monthly Consumption × Electricity Cost Per Unit</li>
                  <li>• <span className="font-medium">Net Revenue</span>: Revenue − (Electricity + Operational + Misc Costs)</li>
                  <li>• <span className="font-medium">ROI (Months)</span>: Total Investment ÷ Monthly Net Revenue</li>
                  <li>• <span className="font-medium">ROI (Years)</span>: ROI Months ÷ 12</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
              <p className="font-medium text-yellow-800">Important Notes:</p>
              <ul className="mt-1 space-y-1 text-yellow-700">
                <li>• All chargers come with a 1-year warranty</li>
                <li>• Installation is included in the price (excluding civil work)</li>
                <li>• Results are estimates and actual performance may vary</li>
                <li>• Multiple usage scenarios (1-5 hours/day) are provided for comparison</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationSection;
