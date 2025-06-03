
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartCardProps {
  title: string;
  data?: Array<{ name: string; value: number }>;
  height?: number;
  type?: 'line' | 'area';
}

const defaultData = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'Mai', value: 500 },
  { name: 'Jun', value: 700 },
];

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data = defaultData,
  height = 300,
  type = 'area'
}) => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">
            {title}
          </CardTitle>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                  dot={{ fill: '#6366F1', strokeWidth: 3, r: 5 }}
                  activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 3, fill: 'white' }}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1"
                  strokeWidth={4}
                  dot={{ fill: '#6366F1', strokeWidth: 3, r: 5 }}
                  activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 3, fill: 'white' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
