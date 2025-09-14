import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sun, Zap, MapPin, ArrowRight } from 'lucide-react';

export function WelcomeCard() {
  return (
    <Card className="p-8 bg-gradient-to-br from-white/70 to-blue-50/70 dark:from-gray-800/70 dark:to-gray-900/70 backdrop-blur-sm border-white/30 dark:border-gray-600/30 shadow-xl">
      <div className="text-center space-y-6">
        {/* Hero Image */}
        <div className="relative mx-auto w-64 h-40 rounded-2xl overflow-hidden shadow-lg">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneSUyMGdyYWRpZW50fGVufDF8fHx8MTc1NzgwNDY0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Solar panels with gradient sky"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sun className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Welcome to SunSight AI
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Get accurate solar energy predictions for Indian cities with our AI-powered analytics
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Select your city and system parameters from the sidebar to generate personalized 
            solar power predictions, optimization recommendations, and 24-hour energy forecasts.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-sm">40+ Indian Cities</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Comprehensive coverage across major Indian cities</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-sm">Real-time Weather</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Live weather data for accurate predictions</p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-sm">AI Optimization</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Smart recommendations for better efficiency</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-100/50 to-green-100/50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl border border-white/30 dark:border-gray-600/30">
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm">Start by selecting a city from the sidebar</span>
          </div>
        </div>
      </div>
    </Card>
  );
}