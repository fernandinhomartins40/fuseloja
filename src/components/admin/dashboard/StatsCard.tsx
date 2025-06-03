
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
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-rose-600';
      default: return 'text-slate-600';
    }
  };

  const getCardGradient = () => {
    switch (trend) {
      case 'up': return 'bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'down': return 'bg-gradient-to-br from-rose-50 to-rose-100';
      default: return 'bg-gradient-to-br from-blue-50 to-blue-100';
    }
  };

  const getIconColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-rose-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Card className={`${getCardGradient()} border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 mb-2">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
            <div className="flex items-center">
              <p className="text-sm text-slate-600">{description}</p>
              {trendValue && (
                <span className={`text-sm font-bold ml-2 ${getTrendColor()} flex items-center gap-1`}>
                  <span className="text-lg">
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                  </span>
                  {trendValue}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Icon className={`w-8 h-8 ${getIconColor()}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
