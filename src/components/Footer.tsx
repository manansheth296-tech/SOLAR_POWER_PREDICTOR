import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Sun, Shield, Info } from 'lucide-react';

export function Footer() {
  return (
    <Card className="mt-8 p-6 bg-white/60 backdrop-blur-sm border-white/30 shadow-lg">
      <div className="space-y-4">
        {/* Disclaimer */}
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="text-sm text-gray-700">⚠️ Important Disclaimer</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              SunSight AI provides estimated solar energy predictions for informational purposes only. 
              Actual solar panel performance may vary based on weather conditions, equipment quality, 
              installation factors, and local regulations. Please consult with certified solar installers 
              and engineers for professional system design and installation.
            </p>
          </div>
        </div>

        <Separator className="opacity-30" />

        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span className="text-sm bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              SunSight AI
            </span>
            <span className="text-xs text-gray-500">v1.0</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Secure & Private</span>
            </div>
            <span>© 2024 SunSight AI</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Powered by Open-Meteo Weather API • Built for Indian Solar Market • 
            Supporting Renewable Energy Transition
          </p>
        </div>
      </div>
    </Card>
  );
}