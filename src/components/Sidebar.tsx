import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { ThemeToggle } from './ThemeToggle';
import { MapPin, Zap, RotateCcw } from 'lucide-react';

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar',
  'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Howrah', 'Ranchi',
  'Gwalior', 'Jabalpur', 'Coimbatore'
];

interface SidebarProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  systemCapacity: number[];
  onCapacityChange: (value: number[]) => void;
  tiltAngle: number[];
  onTiltAngleChange: (value: number[]) => void;
  onFetchPrediction: () => void;
  isLoading: boolean;
}

export function Sidebar({
  selectedCity,
  onCityChange,
  systemCapacity,
  onCapacityChange,
  tiltAngle,
  onTiltAngleChange,
  onFetchPrediction,
  isLoading
}: SidebarProps) {
  return (
    <div className="w-80 min-h-screen bg-gradient-to-b from-blue-50/80 to-green-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-md border-r border-white/20 dark:border-gray-700/20 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              SunSight AI
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Solar Power Predictor</p>
        </div>

        {/* City Selection */}
        <Card className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-600/30 shadow-lg">
          <Label className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4" />
            Select City
          </Label>
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/30">
              <SelectValue placeholder="Choose an Indian city" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {INDIAN_CITIES.map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* System Parameters */}
        <Card className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-600/30 shadow-lg">
          <h3 className="mb-4">System Parameters</h3>
          
          <div className="space-y-6">
            {/* System Capacity */}
            <div>
              <Label className="mb-3 block">
                System Capacity: {systemCapacity[0]} kW
              </Label>
              <Slider
                value={systemCapacity}
                onValueChange={onCapacityChange}
                max={100}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1 kW</span>
                <span>100 kW</span>
              </div>
            </div>

            {/* Tilt Angle */}
            <div>
              <Label className="mb-3 block flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Tilt Angle: {tiltAngle[0]}°
              </Label>
              <Slider
                value={tiltAngle}
                onValueChange={onTiltAngleChange}
                max={90}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0°</span>
                <span>90°</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Fetch Button */}
        <Button 
          onClick={onFetchPrediction}
          disabled={!selectedCity || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg"
          size="lg"
        >
          {isLoading ? 'Fetching...' : 'Fetch Prediction'}
        </Button>
      </div>
    </div>
  );
}