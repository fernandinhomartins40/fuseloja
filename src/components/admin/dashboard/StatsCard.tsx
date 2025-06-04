
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
          gradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100',
          iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
          iconColor: 'text-white',
          trendColor: 'text-emerald-600',
          trendIcon: '↗️',
          border: 'border-emerald-200'
        };
      case 'down': 
        return {
          gradient: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100',
          iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
          iconColor: 'text-white',
          trendColor: 'text-rose-600',
          trendIcon: '↘️',
          border: 'border-rose-200'
        };
      default: 
        return {
          gradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100',
          iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
          iconColor: 'text-white',
          trendColor: 'text-blue-600',
          trendIcon: '➡️',
          border: 'border-blue-200'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <Card className={`${styles.gradient} ${styles.border} border-2 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group overflow-hidden relative`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-black text-slate-900 mb-2 leading-none">{value}</p>
          </div>
          <div className={`w-16 h-16 ${styles.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-300`}>
            <Icon className={`w-8 h-8 ${styles.iconColor}`} />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 font-medium">{description}</p>
          {trendValue && (
            <div className={`flex items-center gap-1 ${styles.trendColor} bg-white bg-opacity-70 px-3 py-1 rounded-full`}>
              <span className="text-sm">{styles.trendIcon}</span>
              <span className="text-sm font-bold">{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
