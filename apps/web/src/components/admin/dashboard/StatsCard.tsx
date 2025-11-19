
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
  const getCardStyles = () => {
    switch (trend) {
      case 'up': 
        return {
          iconBg: 'bg-green-50',
          iconColor: 'text-green-600',
          trendColor: 'text-green-600',
          trendIcon: '↗',
          border: 'border-green-100'
        };
      case 'down': 
        return {
          iconBg: 'bg-red-50',
          iconColor: 'text-red-600',
          trendColor: 'text-red-600',
          trendIcon: '↘',
          border: 'border-red-100'
        };
      default: 
        return {
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-600',
          trendColor: 'text-blue-600',
          trendIcon: '→',
          border: 'border-blue-100'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <Card className={`bg-white ${styles.border} border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">{value}</p>
          </div>
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${styles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.iconColor}`} />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
          {trendValue && (
            <div className={`flex items-center gap-1 ${styles.trendColor} text-xs sm:text-sm font-medium flex-shrink-0`}>
              <span>{styles.trendIcon}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
