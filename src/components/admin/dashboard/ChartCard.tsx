
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
    <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg" />
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg" />
            <div className="w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div style={{ height }} className="p-4 bg-white bg-opacity-60 rounded-2xl backdrop-blur-sm">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    fontSize: '14px',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="url(#colorValue)"
                  strokeWidth={4}
                  fill="url(#colorValue)"
                  dot={{ fill: '#6366F1', strokeWidth: 4, r: 6 }}
                  activeDot={{ r: 10, stroke: '#6366F1', strokeWidth: 4, fill: 'white' }}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    fontSize: '14px',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1"
                  strokeWidth={5}
                  dot={{ fill: '#6366F1', strokeWidth: 4, r: 6 }}
                  activeDot={{ r: 10, stroke: '#6366F1', strokeWidth: 4, fill: 'white' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
