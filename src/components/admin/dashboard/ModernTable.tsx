
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableData {
  [key: string]: any;
}

interface ModernTableProps {
  title: string;
  columns: TableColumn[];
  data: TableData[];
  emptyMessage?: string;
}

export const ModernTable: React.FC<ModernTableProps> = ({
  title,
  columns,
  data,
  emptyMessage = "Nenhum dado encontrado"
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Entregue': { 
        className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold px-4 py-2 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-300' 
      },
      'Enviado': { 
        className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-4 py-2 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-300' 
      },
      'Em processamento': { 
        className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-4 py-2 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-300' 
      },
      'Aguardando pagamento': { 
        className: 'bg-gradient-to-r from-slate-500 to-gray-500 text-white font-bold px-4 py-2 rounded-full text-xs shadow-lg hover:shadow-xl transition-all duration-300' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aguardando pagamento'];
    
    return (
      <span className={config.className}>
        {status}
      </span>
    );
  };

  const renderCellContent = (value: any, key: string) => {
    if (key === 'status') {
      return getStatusBadge(value);
    }
    return value;
  };

  return (
    <Card className="bg-gradient-to-br from-white via-slate-50 to-blue-50 border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="text-xl font-bold">
            {title}
          </CardTitle>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white bg-opacity-60 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-white bg-opacity-40 rounded-full" />
            <div className="w-3 h-3 bg-white bg-opacity-20 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative z-10">
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
            <p className="text-slate-600 font-bold text-lg">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-8 py-5 text-left text-xs font-black text-slate-800 uppercase tracking-wider ${
                        column.align === 'center' ? 'text-center' :
                        column.align === 'right' ? 'text-right' : ''
                      }`}
                      style={{ width: column.width }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 transition-all duration-300 group">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors duration-300 ${
                          column.align === 'center' ? 'text-center' :
                          column.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {renderCellContent(row[column.key], column.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
