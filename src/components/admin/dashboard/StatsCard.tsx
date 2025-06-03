
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend = 'neutral',
  trendValue
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getIconBackground = () => {
    switch (trend) {
      case 'up': return 'bg-green-100';
      case 'down': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  };

  const getIconColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm text-gray-500">{description}</p>
              {trendValue && (
                <span className={`text-sm font-medium ml-2 ${getTrendColor()} flex items-center gap-1`}>
                  <span className="text-base">
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                  </span>
                  {trendValue}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className={`w-12 h-12 ${getIconBackground()} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${getIconColor()}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
