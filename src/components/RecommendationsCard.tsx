import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Lightbulb, TrendingUp, Shield, Sun } from 'lucide-react';

interface Recommendation {
  type: 'optimization' | 'maintenance' | 'seasonal' | 'performance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface RecommendationsCardProps {
  recommendations: Recommendation[];
  optimalTilt: number;
  seasonalTip: string;
}

export function RecommendationsCard({ recommendations, optimalTilt, seasonalTip }: RecommendationsCardProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'maintenance': return Shield;
      case 'seasonal': return Sun;
      default: return Lightbulb;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Card className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-600/30 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3>System Recommendations</h3>
      </div>

      <div className="space-y-4">
        {/* Optimal Tilt */}
        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm">Tilt Optimization</span>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">High Impact</Badge>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            For maximum efficiency, set your panels to <strong>{optimalTilt}°</strong> tilt angle. 
            This can increase your energy output by up to 15%.
          </p>
        </div>

        {/* Seasonal Tip */}
        <div className="p-4 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm">Seasonal Advice</span>
            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800">Medium Impact</Badge>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{seasonalTip}</p>
        </div>

        {/* Dynamic Recommendations */}
        {recommendations.map((rec, index) => {
          const Icon = getIconForType(rec.type);
          return (
            <div key={index} className="p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm">{rec.title}</span>
                <Badge className={getImpactColor(rec.impact)}>
                  {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                </Badge>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rec.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 Implementing these recommendations could improve your system efficiency by 10-25%
        </p>
      </div>
    </Card>
  );
}