import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StatCard } from './StatCard';
import { SolarChart } from './SolarChart';
import { RecommendationsCard } from './RecommendationsCard';
import { Footer } from './Footer';
import { ThemeToggle } from './ThemeToggle';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PredictionParams } from './InputPage';

interface ResultsPageProps {
  predictionData: any;
  predictionParams: PredictionParams;
  onGoBack: () => void;
}

export function ResultsPage({ predictionData, predictionParams, onGoBack }: ResultsPageProps) {
  if (!predictionData) {
    return null;
  }

  const { peakPower, dailyEnergy, systemEfficiency, chartData, recommendations, seasonalTip } = predictionData;
  const monthlyEnergy = dailyEnergy * 30; // Approximate monthly energy

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1732203971761-e9d4a6f5e93f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU3NzMxNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern dashboard background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-purple-200/20 to-green-200/30 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-green-900/30" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      
      {/* Header */}
      <div className="relative z-10 border-b border-border/50 backdrop-blur-md bg-card/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              className="hover:bg-accent/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Input Page
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                ☀️ Prediction for {predictionParams.city}
              </h1>
              {predictionParams.isGPSDetected && (
                <p className="text-muted-foreground">📍 Location auto-detected with live weather data</p>
              )}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Metric Cards - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Peak Power"
            value={`${peakPower.toFixed(1)} kW`}
            icon="⚡"
            description="Maximum power output"
          />
          <StatCard
            title="Daily Energy"
            value={`${dailyEnergy.toFixed(1)} kWh`}
            icon="🔋"
            description="Average daily generation"
          />
          <StatCard
            title="Monthly Energy"
            value={`${monthlyEnergy.toFixed(0)} kWh`}
            icon="📅"
            description="Estimated monthly output"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance Analysis Card - Left Column (spans 2 columns) */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-md bg-card/80 border-border/50 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SolarChart data={chartData} />
              </CardContent>
            </Card>
          </div>
          
          {/* Smart Recommendations Card - Right Column */}
          <div className="lg:col-span-1">
            <RecommendationsCard
              recommendations={recommendations}
              seasonalTip={seasonalTip}
              systemEfficiency={systemEfficiency}
              optimalTilt={predictionData.optimalTilt}
            />
          </div>
        </div>
        
        {/* System Parameters Card */}
        <Card className="backdrop-blur-md bg-card/80 border-border/50 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 System Parameters Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground">System Capacity</p>
                <p>{predictionParams.systemCapacity} kW</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Ambient Temperature</p>
                <p>{predictionParams.ambientTemperature}°C</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Solar Irradiation</p>
                <p>{predictionParams.solarIrradiation} kW/m²</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">System Efficiency</p>
                <p>{systemEfficiency.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Humidity</p>
                <p>{predictionParams.humidity}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Cloud Cover</p>
                <p>{predictionParams.cloudCover}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Wind Speed</p>
                <p>{predictionParams.windSpeed} km/h</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Tilt Angle</p>
                <p>{predictionParams.tiltAngle}°</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Footer />
      </div>
    </div>
  );
}