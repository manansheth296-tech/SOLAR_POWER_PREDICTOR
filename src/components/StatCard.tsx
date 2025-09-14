import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: string | LucideIcon;
  trend?: 'up' | 'down';
  description?: string;
}

export function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  const renderIcon = () => {
    if (typeof icon === 'string') {
      // It's an emoji string
      return (
        <span className="text-2xl">{icon}</span>
      );
    } else {
      // It's a Lucide icon component
      const IconComponent = icon;
      return <IconComponent className="h-6 w-6 text-white" />;
    }
  };

  return (
    <Card className="backdrop-blur-md bg-card/80 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground mb-2">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                {value}
              </span>
            </div>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 shadow-md">
            {renderIcon()}
          </div>
        </div>
      </div>
    </Card>
  );
}