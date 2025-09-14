// API service for solar prediction model integration

interface WeatherData {
  temperature: number;
  humidity: number;
  solarIrradiance: number;
  cloudCover: number;
  windSpeed: number;
  pressure: number;
}

interface SolarPredictionInput {
  city: string;
  latitude: number;
  longitude: number;
  systemCapacity: number;
  tiltAngle: number;
  azimuthAngle?: number;
  panelEfficiency?: number;
  weather: WeatherData;
}

interface SolarPredictionOutput {
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

// City coordinates for Indian cities
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Delhi': { lat: 28.7041, lon: 77.1025 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Surat': { lat: 21.1702, lon: 72.8311 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Kanpur': { lat: 26.4499, lon: 80.3319 },
  'Nagpur': { lat: 21.1458, lon: 79.0882 },
  'Indore': { lat: 22.7196, lon: 75.8577 },
  'Thane': { lat: 19.2183, lon: 72.9781 },
  'Bhopal': { lat: 23.2599, lon: 77.4126 },
  'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'Patna': { lat: 25.5941, lon: 85.1376 },
  'Vadodara': { lat: 22.3072, lon: 73.1812 },
  'Ghaziabad': { lat: 28.6692, lon: 77.4538 },
  'Ludhiana': { lat: 30.9010, lon: 75.8573 },
  'Agra': { lat: 27.1767, lon: 78.0081 },
  'Nashik': { lat: 19.9975, lon: 73.7898 },
  'Faridabad': { lat: 28.4089, lon: 77.3178 },
  'Meerut': { lat: 28.9845, lon: 77.7064 },
  'Rajkot': { lat: 22.3039, lon: 70.8022 },
  'Kalyan-Dombivli': { lat: 19.2403, lon: 73.1305 },
  'Vasai-Virar': { lat: 19.4912, lon: 72.8054 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Srinagar': { lat: 34.0837, lon: 74.7973 },
  'Aurangabad': { lat: 19.8762, lon: 75.3433 },
  'Dhanbad': { lat: 23.7957, lon: 86.4304 },
  'Amritsar': { lat: 31.6340, lon: 74.8723 },
  'Navi Mumbai': { lat: 19.0330, lon: 73.0297 },
  'Allahabad': { lat: 25.4358, lon: 81.8463 },
  'Howrah': { lat: 22.5958, lon: 88.2636 },
  'Ranchi': { lat: 23.3441, lon: 85.3096 },
  'Gwalior': { lat: 26.2183, lon: 78.1828 },
  'Jabalpur': { lat: 23.1815, lon: 79.9864 },
  'Coimbatore': { lat: 11.0168, lon: 76.9558 }
};

class SolarPredictionAPI {
  private baseURL: string;
  private weatherAPIKey: string;

  constructor() {
    // Configure these with your actual API endpoints
    this.baseURL = process.env.REACT_APP_SOLAR_API_URL || 'http://localhost:8000';
    this.weatherAPIKey = process.env.REACT_APP_WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY';
  }

  // Fetch current weather data from Open-Meteo API (free, no API key required)
  private async fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,cloud_cover&hourly=solar_radiation_instant&timezone=Asia/Kolkata&forecast_days=1`;
      
      const response = await fetch(weatherURL);
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      const current = data.current;
      const hourly = data.hourly;
      
      // Get current hour's solar radiation
      const currentHour = new Date().getHours();
      const solarIrradiance = hourly.solar_radiation_instant[currentHour] || 0;
      
      return {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        solarIrradiance,
        cloudCover: current.cloud_cover,
        windSpeed: current.wind_speed_10m,
        pressure: current.surface_pressure
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Return fallback weather data
      return {
        temperature: 28,
        humidity: 65,
        solarIrradiance: 800,
        cloudCover: 20,
        windSpeed: 5,
        pressure: 1013
      };
    }
  }

  // Call your solar prediction model
  private async callSolarPredictionModel(input: SolarPredictionInput): Promise<SolarPredictionOutput> {
    try {
      // Replace this URL with your actual model endpoint
      const response = await fetch(`${this.baseURL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers here
          // 'Authorization': `Bearer ${your_api_token}`,
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`Model API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Solar prediction model error:', error);
      // Fallback to enhanced mock data if model is unavailable
      return this.generateEnhancedMockPrediction(input);
    }
  }

  // Enhanced mock data generation (fallback when model is unavailable)
  private generateEnhancedMockPrediction(input: SolarPredictionInput): SolarPredictionOutput {
    const { city, systemCapacity, tiltAngle, weather } = input;
    
    // Enhanced efficiency calculation based on real weather data
    const baseEfficiency = 0.85; // 85% base panel efficiency
    const temperatureEffect = Math.max(0.7, 1 - (weather.temperature - 25) * 0.004);
    const cloudEffect = Math.max(0.3, 1 - weather.cloudCover / 100);
    const irradianceEffect = Math.min(1, weather.solarIrradiance / 1000);
    
    // Tilt angle optimization
    const latitude = CITY_COORDINATES[city]?.lat || 20;
    const optimalTilt = Math.round(latitude * 0.9); // Approximate optimal tilt
    const tiltEffect = Math.max(0.7, 1 - Math.abs(tiltAngle - optimalTilt) * 0.01);
    
    const systemEfficiency = Math.min(95, 
      baseEfficiency * temperatureEffect * cloudEffect * irradianceEffect * tiltEffect * 100
    );
    
    const peakPower = systemCapacity * (systemEfficiency / 100);
    
    // Enhanced daily energy calculation based on seasonal and weather patterns
    const month = new Date().getMonth();
    const seasonalMultiplier = month >= 2 && month <= 5 ? 1.1 : // Summer
                              month >= 6 && month <= 9 ? 0.8 : // Monsoon
                              0.9; // Winter
    
    const dailyEnergy = peakPower * 5.5 * seasonalMultiplier * cloudEffect;
    
    // Generate realistic 24-hour chart data
    const chartData = Array.from({ length: 24 }, (_, i) => {
      let power = 0;
      let efficiency = 0;
      
      if (i >= 6 && i <= 18) { // Daylight hours
        const hourFromNoon = Math.abs(i - 12);
        const sunAngle = Math.max(0, Math.cos((hourFromNoon * Math.PI) / 12));
        const hourlyIrradiance = weather.solarIrradiance * sunAngle * cloudEffect;
        
        power = (systemCapacity * hourlyIrradiance / 1000) * (systemEfficiency / 100);
        efficiency = systemEfficiency * sunAngle;
        
        // Add some realistic variability
        const variability = 1 + (Math.random() - 0.5) * 0.1;
        power *= variability;
        efficiency *= variability;
      }
      
      return {
        hour: `${i.toString().padStart(2, '0')}:00`,
        power: Math.max(0, power),
        efficiency: Math.max(0, efficiency)
      };
    });
    
    // Generate intelligent recommendations
    const recommendations = [];
    
    if (Math.abs(tiltAngle - optimalTilt) > 5) {
      recommendations.push({
        type: 'optimization' as const,
        title: 'Tilt Angle Optimization',
        description: `Adjust tilt from ${tiltAngle}° to ${optimalTilt}° for optimal performance in ${city}.`,
        impact: 'high' as const
      });
    }
    
    if (weather.temperature > 35) {
      recommendations.push({
        type: 'maintenance' as const,
        title: 'Temperature Management',
        description: 'High ambient temperature detected. Ensure proper ventilation around panels.',
        impact: 'medium' as const
      });
    }
    
    if (weather.cloudCover > 60) {
      recommendations.push({
        type: 'performance' as const,
        title: 'Weather Impact',
        description: 'High cloud cover reducing output. Consider battery storage for consistent power.',
        impact: 'medium' as const
      });
    }
    
    // Seasonal advice
    const seasonalTips = {
      summer: 'Summer peak generation period. Monitor panel temperature and ensure adequate cooling.',
      monsoon: 'Monsoon season reduces output by 20-30%. Regular cleaning post-rain is crucial.',
      winter: 'Winter offers clear skies but shorter days. Consider seasonal tilt adjustment.'
    };
    
    const seasonalTip = month >= 2 && month <= 5 ? seasonalTips.summer :
                       month >= 6 && month <= 9 ? seasonalTips.monsoon :
                       seasonalTips.winter;
    
    return {
      peakPower,
      dailyEnergy,
      systemEfficiency,
      chartData,
      recommendations,
      optimalTilt,
      seasonalTip
    };
  }

  // Main prediction method
  async getPrediction(city: string, systemCapacity: number, tiltAngle: number): Promise<SolarPredictionOutput> {
    const coordinates = CITY_COORDINATES[city];
    if (!coordinates) {
      throw new Error(`Coordinates not found for city: ${city}`);
    }

    // Fetch real weather data
    const weather = await this.fetchWeatherData(coordinates.lat, coordinates.lon);
    
    const input: SolarPredictionInput = {
      city,
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      systemCapacity,
      tiltAngle,
      azimuthAngle: 180, // South-facing (default for India)
      panelEfficiency: 20, // 20% efficiency panels (typical)
      weather
    };

    // Try to call your actual model, fallback to enhanced mock if unavailable
    return this.callSolarPredictionModel(input);
  }
}

export const solarAPI = new SolarPredictionAPI();