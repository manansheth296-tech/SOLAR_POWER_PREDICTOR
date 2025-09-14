import { StatCard } from './StatCard';
import { SolarChart } from './SolarChart';
import { RecommendationsCard } from './RecommendationsCard';
import { WelcomeCard } from './WelcomeCard';
import { Footer } from './Footer';
import { Battery, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PredictionData {
  peakPower: number;
  dailyEnergy: number;
  systemEfficiency: number;
  chartData: Array<{
    hour: string;
    power: number;
    efficiency: number;
  }>;
  recommendations: Array<{
    type: 'optimization' | 'maintenance' | 'seasonal' | 'performance';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  optimalTilt: number;
  seasonalTip: string;
}

interface DashboardProps {
  predictionData: PredictionData | null;
  selectedCity: string;
  isLoading: boolean;
  error: string | null;
}

export function Dashboard({ predictionData, selectedCity, isLoading, error }: DashboardProps) {
  // Show welcome screen if no prediction data
  if (!predictionData && !isLoading && !error) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <WelcomeCard />
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="text-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg text-gray-700 dark:text-gray-300">Analyzing solar conditions for {selectedCity}...</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few seconds</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <Alert className="bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
        <WelcomeCard />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl mb-2">
          Solar Prediction for <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{selectedCity}</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Generated on {new Date().toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Peak Power Output"
          value={predictionData.peakPower.toFixed(1)}
          unit="kW"
          icon={Zap}
          gradient="from-yellow-500 to-orange-500"
          description="Maximum power at peak sun hours"
        />
        <StatCard
          title="Daily Energy Generation"
          value={predictionData.dailyEnergy.toFixed(1)}
          unit="kWh"
          icon={Battery}
          gradient="from-green-500 to-emerald-500"
          description="Total energy produced per day"
        />
        <StatCard
          title="System Efficiency"
          value={predictionData.systemEfficiency.toFixed(1)}
          unit="%"
          icon={TrendingUp}
          gradient="from-blue-500 to-indigo-500"
          description="Overall system performance"
        />
      </div>

      {/* Chart */}
      <SolarChart data={predictionData.chartData} />

      {/* Recommendations */}
      <RecommendationsCard
        recommendations={predictionData.recommendations}
        optimalTilt={predictionData.optimalTilt}
        seasonalTip={predictionData.seasonalTip}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}