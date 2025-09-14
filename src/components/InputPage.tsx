import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { Loader2, MapPin, Settings, Satellite } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface InputPageProps {
  onNavigateToResults: (params: PredictionParams) => void;
}

export interface PredictionParams {
  city: string;
  systemCapacity: number;
  ambientTemperature: number;
  solarIrradiation: number;
  humidity: number;
  cloudCover: number;
  windSpeed: number;
  tiltAngle: number;
  isGPSDetected: boolean;
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Coimbatore', 'Agra', 'Madurai',
  'Nashik', 'Kalyan', 'Vasai', 'Varanasi', 'Dhanbad', 'Aurangabad', 'Rajkot', 'Kota',
  'Gwalior', 'Chandigarh', 'Solapur', 'Hubli', 'Mysore', 'Tiruchirappalli', 'Bareilly'
];

export function InputPage({ onNavigateToResults }: InputPageProps) {
  // Auto-detect form state
  const [autoCapacity, setAutoCapacity] = useState('10');
  const [isGPSLoading, setIsGPSLoading] = useState(false);
  
  // Manual form state
  const [selectedCity, setSelectedCity] = useState('');
  const [manualCapacity, setManualCapacity] = useState('10');
  const [ambientTemperature, setAmbientTemperature] = useState('25');
  const [solarIrradiation, setSolarIrradiation] = useState('5.5');
  const [humidity, setHumidity] = useState('65');
  const [cloudCover, setCloudCover] = useState('20');
  const [windSpeed, setWindSpeed] = useState('15');
  const [tiltAngle, setTiltAngle] = useState('25');

  const handleGPSDetection = async () => {
    setIsGPSLoading(true);
    
    try {
      // Simulate GPS detection and weather API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate getting a random Indian city
      const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      
      // Simulate live weather data
      const mockWeatherData = {
        city: randomCity,
        ambientTemperature: Math.round(20 + Math.random() * 20), // 20-40°C
        solarIrradiation: Math.round((4 + Math.random() * 3) * 10) / 10, // 4-7 kW/m²
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        cloudCover: Math.round(Math.random() * 60), // 0-60%
        windSpeed: Math.round(5 + Math.random() * 25) // 5-30 km/h
      };
      
      const params: PredictionParams = {
        city: mockWeatherData.city,
        systemCapacity: parseFloat(autoCapacity),
        ambientTemperature: mockWeatherData.ambientTemperature,
        solarIrradiation: mockWeatherData.solarIrradiation,
        humidity: mockWeatherData.humidity,
        cloudCover: mockWeatherData.cloudCover,
        windSpeed: mockWeatherData.windSpeed,
        tiltAngle: 25, // Default optimal tilt
        isGPSDetected: true
      };
      
      onNavigateToResults(params);
    } catch (error) {
      console.error('GPS detection failed:', error);
    } finally {
      setIsGPSLoading(false);
    }
  };

  const handleManualPrediction = () => {
    if (!selectedCity) return;
    
    const params: PredictionParams = {
      city: selectedCity,
      systemCapacity: parseFloat(manualCapacity),
      ambientTemperature: parseFloat(ambientTemperature),
      solarIrradiation: parseFloat(solarIrradiation),
      humidity: parseFloat(humidity),
      cloudCover: parseFloat(cloudCover),
      windSpeed: parseFloat(windSpeed),
      tiltAngle: parseFloat(tiltAngle),
      isGPSDetected: false
    };
    
    onNavigateToResults(params);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-orange-100 via-blue-50 to-green-100 dark:from-orange-950 dark:via-blue-950 dark:to-green-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-orange-200/20 to-red-200/20 dark:from-yellow-800/20 dark:via-orange-800/20 dark:to-red-800/20" />
      </div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            ☀️ SunSight AI
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your system details to get accurate solar power predictions for your location
          </p>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Auto-Detect Card */}
          <Card className="backdrop-blur-md bg-card/80 border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                📍 Auto-Detect (Recommended)
              </CardTitle>
              <p className="text-muted-foreground">
                Use your current location and live weather data for the most accurate predictions
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="auto-capacity">System Capacity (kW)</Label>
                <Input
                  id="auto-capacity"
                  type="number"
                  value={autoCapacity}
                  onChange={(e) => setAutoCapacity(e.target.value)}
                  placeholder="10"
                  min="1"
                  max="1000"
                  step="0.1"
                  className="bg-input-background/50 backdrop-blur-sm"
                />
              </div>
              
              <Button 
                onClick={handleGPSDetection}
                disabled={isGPSLoading || !autoCapacity}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
              >
                {isGPSLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Detecting Location & Fetching Weather...
                  </>
                ) : (
                  <>
                    <Satellite className="mr-2 h-4 w-4" />
                    🛰️ Use Current Location & Predict
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* Manual Configuration Card */}
          <Card className="backdrop-blur-md bg-card/80 border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                ⚙️ Manual Configuration
              </CardTitle>
              <p className="text-muted-foreground">
                Manually configure all parameters for custom predictions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city-select">City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-input-background/50 backdrop-blur-sm">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-capacity">System Capacity (kW)</Label>
                  <Input
                    id="manual-capacity"
                    type="number"
                    value={manualCapacity}
                    onChange={(e) => setManualCapacity(e.target.value)}
                    placeholder="10"
                    min="1"
                    max="1000"
                    step="0.1"
                    className="bg-input-background/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Ambient Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={ambientTemperature}
                    onChange={(e) => setAmbientTemperature(e.target.value)}
                    placeholder="25"
                    min="-10"
                    max="50"
                    className="bg-input-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="irradiation">Solar Irradiation (kW/m²)</Label>
                <Input
                  id="irradiation"
                  type="number"
                  value={solarIrradiation}
                  onChange={(e) => setSolarIrradiation(e.target.value)}
                  placeholder="5.5"
                  min="0"
                  max="10"
                  step="0.1"
                  className="bg-input-background/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder="65"
                    min="0"
                    max="100"
                    step="1"
                    className="bg-input-background/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cloud-cover">Cloud Cover (%)</Label>
                  <Input
                    id="cloud-cover"
                    type="number"
                    value={cloudCover}
                    onChange={(e) => setCloudCover(e.target.value)}
                    placeholder="20"
                    min="0"
                    max="100"
                    step="1"
                    className="bg-input-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wind-speed">Wind Speed (km/h)</Label>
                  <Input
                    id="wind-speed"
                    type="number"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(e.target.value)}
                    placeholder="15"
                    min="0"
                    max="50"
                    step="1"
                    className="bg-input-background/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tilt-angle">Tilt Angle (°)</Label>
                  <Input
                    id="tilt-angle"
                    type="number"
                    value={tiltAngle}
                    onChange={(e) => setTiltAngle(e.target.value)}
                    placeholder="25"
                    min="0"
                    max="90"
                    step="1"
                    className="bg-input-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleManualPrediction}
                disabled={!selectedCity || !manualCapacity}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                📊 Generate Prediction
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}