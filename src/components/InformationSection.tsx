import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
interface InformationSectionProps {
  chargerType: 'AC' | 'DC';
}
const InformationSection: React.FC<InformationSectionProps> = ({
  chargerType
}) => {
  return <div className="mt-16 space-y-8" id="about">
      {/* Understanding the Calculator */}
      <div>
        <h2 className="text-2xl font-bold font-poppins mb-2 bg-premium-gradient bg-clip-text text-transparent inline-block">
          Understanding the {chargerType} ROI Calculator
        </h2>
        <Card className="mt-4">
          <CardContent className="pt-6">
            {chargerType === 'AC' ? <div className="space-y-4 text-gray-700">
                <p>
                  The AC ROI calculator helps you determine how much you can save by charging your electric vehicle at home 
                  compared to refueling a petrol/diesel vehicle or using public charging stations.
                </p>
                <p>
                  By inputting your daily driving habits, electricity tariff, and other parameters, you can see a detailed 
                  breakdown of your potential savings and understand when your investment in a home EV charger will pay for itself.
                </p>
                <p>
                  The calculator takes into account the initial investment cost, your usage patterns, and compares the ongoing 
                  operational costs to give you a clear picture of the financial benefits.
                </p>
              </div> : <div className="space-y-4 text-gray-700">
                <p>
                  Our DC ROI calculator is designed for businesses looking to invest in DC fast charging infrastructure 
                  for electric vehicles. It helps you understand the potential return on your investment based on several key factors.
                </p>
                <p>
                  By entering your expected usage levels, electricity rates, and charging fees, you can generate detailed 
                  projections of revenue, costs, and profits over time. The calculator provides insights into when your 
                  investment will break even and what kind of returns you can expect in the years following.
                </p>
                <p>
                  This tool is invaluable for businesses planning to deploy DC fast charging stations as part of their 
                  service offerings or as an amenity for customers and employees.
                </p>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Our Charger Lineup */}
      <div className="py-[10px]">
        <h2 className="text-2xl font-bold font-poppins mb-2 bg-premium-gradient bg-clip-text text-transparent inline-block">
          Our {chargerType} Charger Lineup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {chargerType === 'AC' ? <>
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="h-2 bg-premium-gradient"></div>
                <CardHeader>
                  <CardTitle>Thunder Lite 3.3 kW AC</CardTitle>
                  <CardDescription>Entry-Level Home Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Designed for overnight charging, the Thunder Lite offers reliable charging for 
                    daily commuters with standard driving needs. Perfect for home installation with 
                    minimal electrical requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="h-2 bg-premium-gradient"></div>
                <CardHeader>
                  <CardTitle>Thunder Smart 7.4 kW AC</CardTitle>
                  <CardDescription>Smart Home Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Our most popular home charging solution, the Thunder Smart balances charging speed 
                    with cost-effectiveness. Features smart charging capabilities and mobile app integration 
                    for optimal charging management.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="h-2 bg-premium-gradient"></div>
                <CardHeader>
                  <CardTitle>Thunder Blaze 22 kW AC</CardTitle>
                  <CardDescription>Premium Fast Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Our premium offering for homes and small businesses, the Thunder Blaze delivers 
                    the fastest AC charging possible. Ideal for multi-vehicle households or locations 
                    where vehicles need to charge quickly between uses.
                  </p>
                </CardContent>
              </Card>
            </> : <>
              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="h-2 bg-premium-gradient"></div>
                <CardHeader>
                  <CardTitle>Thunder Swift 30 kW DC</CardTitle>
                  <CardDescription>Entry-Level DC Fast Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    The Thunder Swift is our compact DC fast charging solution, perfect for small businesses, 
                    retail locations, and municipal installations. It offers a balance of power and affordability.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="h-2 bg-premium-gradient"></div>
                <CardHeader>
                  <CardTitle>Thunder Falcon 60 kW DC</CardTitle>
                  <CardDescription>Mid-Range Fast Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Our Thunder Falcon charger delivers substantial charging power for locations with moderate 
                    to high traffic. Ideal for shopping centers, hotels, and highway corridor installations.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all">
                <div className="h-2 bg-premium-gradient"></div>
                <CardHeader>
                  <CardTitle>Thunder Hulk 120 kW DC</CardTitle>
                  <CardDescription>High-Power Fast Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    The Thunder Hulk delivers exceptional charging power for high-traffic locations where speed 
                    is essential. Perfect for highway service stations and commercial fleet operations.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-all border-2 border-yellow-400">
                <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Thunder Hornet 240 kW DC
                    <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-bold">FLAGSHIP</span>
                  </CardTitle>
                  <CardDescription>Premium Ultra-Fast Charging</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Our flagship Thunder Hornet represents the pinnacle of DC fast charging technology, delivering 
                    unmatched 240kW power for ultra-rapid charging. Engineered for the most demanding commercial 
                    applications and future-ready installations.
                  </p>
                </CardContent>
              </Card>
            </>}
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold font-poppins mb-2 bg-premium-gradient bg-clip-text text-transparent inline-block">
          Important Notes
        </h2>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>All calculations are estimates and actual results may vary based on specific vehicle models, driving conditions, and electricity rates.</li>
              <li>The calculator assumes consistent usage patterns as specified in your inputs.</li>
              <li>For DC chargers, revenue estimates are based on your specified utilization rates and charging fees.</li>
              <li>We recommend consulting with our experts for a personalized assessment of your specific situation.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default InformationSection;