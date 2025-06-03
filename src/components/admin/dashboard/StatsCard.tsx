
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
      case 'up': return 'from-emerald-50 via-white to-emerald-50/30';
      case 'down': return 'from-rose-50 via-white to-rose-50/30';
      default: return 'from-blue-50 via-white to-purple-50/30';
    }
  };

  const getIconBackground = () => {
    switch (trend) {
      case 'up': return 'bg-gradient-to-br from-emerald-400 to-emerald-600';
      case 'down': return 'bg-gradient-to-br from-rose-400 to-rose-600';
      default: return 'bg-gradient-to-br from-blue-400 to-purple-600';
    }
  };

  return (
    <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${getCardGradient()} group hover:scale-105 transform`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{value}</p>
            <div className="flex items-center mt-2">
              <p className="text-sm text-slate-500">{description}</p>
              {trendValue && (
                <span className={`text-sm font-semibold ml-2 ${getTrendColor()} flex items-center gap-1`}>
                  <span className="text-lg">
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                  </span>
                  {trendValue}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className={`w-14 h-14 ${getIconBackground()} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
      </CardContent>
    </Card>
  );
};
