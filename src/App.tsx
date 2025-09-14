import { useState } from 'react';
import { InputPage, PredictionParams } from './components/InputPage';
import { ResultsPage } from './components/ResultsPage';

// Enhanced mock data generator for solar predictions with weather parameters
const generateMockPrediction = (params: PredictionParams) => {
  const { city, systemCapacity, ambientTemperature, solarIrradiation, humidity, cloudCover, windSpeed, tiltAngle } = params;
  
  // Base efficiency varies by city (simulating different weather patterns)
  const cityEfficiencyMap: Record<string, number> = {
    'Mumbai': 75, 'Delhi': 72, 'Bangalore': 82, 'Chennai': 78, 'Kolkata': 70,
    'Hyderabad': 80, 'Pune': 85, 'Ahmedabad': 88, 'Jaipur': 90, 'Lucknow': 68,
    'Kanpur': 70, 'Nagpur': 83, 'Indore': 86, 'Thane': 76, 'Bhopal': 81,
    'Visakhapatnam': 79, 'Pimpri': 84, 'Patna': 69, 'Vadodara': 87, 'Ghaziabad': 71
  };
  
  const baseEfficiency = cityEfficiencyMap[city] || 75;
  
  // Weather impact factors
  const temperatureEffect = 1 - Math.max(0, (ambientTemperature - 25) * 0.004); // Efficiency decreases with high temp
  const humidityEffect = 1 - (humidity / 100) * 0.05; // Humidity reduces efficiency slightly
  const cloudEffect = 1 - (cloudCover / 100) * 0.6; // Cloud cover significantly reduces output
  const windEffect = 1 + Math.min(0.05, windSpeed * 0.002); // Light wind helps cooling
  
  // Tilt angle optimization (optimal around 25-30 degrees for most Indian cities)
  const optimalTilt = 28;
  const tiltEfficiency = 1 - Math.abs(tiltAngle - optimalTilt) * 0.01;
  
  // Combined efficiency calculation
  const weatherEfficiency = temperatureEffect * humidityEffect * cloudEffect * windEffect;
  const systemEfficiency = Math.min(95, baseEfficiency * tiltEfficiency * weatherEfficiency);
  
  // Power calculations based on actual solar irradiation
  const peakPower = systemCapacity * (systemEfficiency / 100) * (solarIrradiation / 5.5); // Normalized to 5.5 kW/m² standard
  const dailyEnergy = peakPower * 5.5; // Average 5.5 peak sun hours in India
  
  // Generate 24-hour chart data
  const chartData = Array.from({ length: 24 }, (_, i) => {
    let power = 0;
    let efficiency = 0;
    
    if (i >= 6 && i <= 18) { // Daylight hours
      // Bell curve for solar generation with weather effects
      const hourFromNoon = Math.abs(i - 12);
      const sunIntensity = Math.max(0, 1 - (hourFromNoon / 6) ** 2);
      power = peakPower * sunIntensity * weatherEfficiency;
      efficiency = systemEfficiency * sunIntensity;
    }
    
    return {
      hour: `${i.toString().padStart(2, '0')}:00`,
      power: Math.max(0, power + (Math.random() - 0.5) * 0.1),
      efficiency: Math.max(0, efficiency + (Math.random() - 0.5) * 2)
    };
  });
  
  // Generate recommendations based on weather and system parameters
  const recommendations = [];
  
  if (Math.abs(tiltAngle - optimalTilt) > 5) {
    recommendations.push({
      type: 'optimization' as const,
      title: 'Tilt Angle Adjustment',
      description: `Your current tilt angle (${tiltAngle}°) is not optimal. Consider adjusting to ${optimalTilt}° for better performance.`,
      impact: 'high' as const
    });
  }
  
  if (cloudCover > 50) {
    recommendations.push({
      type: 'performance' as const,
      title: 'High Cloud Cover Impact',
      description: `Current cloud cover (${cloudCover}%) is significantly reducing output. Consider battery storage for cloudy days.`,
      impact: 'high' as const
    });
  }
  
  if (ambientTemperature > 35) {
    recommendations.push({
      type: 'maintenance' as const,
      title: 'High Temperature Alert',
      description: `High ambient temperature (${ambientTemperature}°C) reduces efficiency. Ensure proper ventilation and consider panel cooling.`,
      impact: 'medium' as const
    });
  }
  
  if (humidity > 80) {
    recommendations.push({
      type: 'maintenance' as const,
      title: 'High Humidity Conditions',
      description: 'High humidity can affect connections and reduce efficiency. Regular maintenance is recommended.',
      impact: 'medium' as const
    });
  }
  
  if (systemCapacity > 50) {
    recommendations.push({
      type: 'maintenance' as const,
      title: 'Regular Cleaning Schedule',
      description: 'Large systems require frequent cleaning. Clean panels monthly to maintain peak efficiency.',
      impact: 'medium' as const
    });
  }
  
  recommendations.push({
    type: 'performance' as const,
    title: 'Shadow Analysis',
    description: 'Ensure no shadows fall on panels between 10 AM - 3 PM for maximum energy generation.',
    impact: 'high' as const
  });
  
  // Seasonal tips based on current month
  const month = new Date().getMonth();
  let seasonalTip = '';
  
  if (month >= 2 && month <= 5) { // March to June (Summer)
    seasonalTip = 'Summer months offer peak solar generation. Ensure proper ventilation around panels to prevent overheating.';
  } else if (month >= 6 && month <= 9) { // July to October (Monsoon/Post-monsoon)
    seasonalTip = 'Monsoon season may reduce output by 20-30%. Clean panels after rain for optimal performance.';
  } else { // November to February (Winter)
    seasonalTip = 'Winter months have clearer skies but shorter days. Consider adjusting tilt angle to capture low-angle sun.';
  }
  
  return {
    peakPower,
    dailyEnergy,
    systemEfficiency,
    chartData,
    recommendations,
    optimalTilt,
    seasonalTip,
    weatherEfficiency: weatherEfficiency * 100
  };
};

type AppPage = 'input' | 'results';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('input');
  const [predictionData, setPredictionData] = useState(null);
  const [predictionParams, setPredictionParams] = useState<PredictionParams | null>(null);

  const handleNavigateToResults = async (params: PredictionParams) => {
    setPredictionParams(params);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate occasional API errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Weather service temporarily unavailable. Please try again in a few moments.');
      }
      
      const mockData = generateMockPrediction(params);
      setPredictionData(mockData);
      setCurrentPage('results');
    } catch (err) {
      console.error('Prediction failed:', err);
      // You could add error handling here
    }
  };

  const handleGoBackToInput = () => {
    setCurrentPage('input');
    setPredictionData(null);
    setPredictionParams(null);
  };

  if (currentPage === 'results' && predictionData && predictionParams) {
    return (
      <ResultsPage
        predictionData={predictionData}
        predictionParams={predictionParams}
        onGoBack={handleGoBackToInput}
      />
    );
  }

  return (
    <InputPage onNavigateToResults={handleNavigateToResults} />
  );
}