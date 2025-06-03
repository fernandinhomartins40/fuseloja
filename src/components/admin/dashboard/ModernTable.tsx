
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
        className: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md' 
      },
      'Enviado': { 
        className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md' 
      },
      'Em processamento': { 
        className: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md' 
      },
      'Aguardando pagamento': { 
        className: 'bg-gradient-to-r from-slate-500 to-gray-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-md' 
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
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-2xl border-b-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">
            {title}
          </CardTitle>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-slate-600 font-semibold">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-gray-50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider ${
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
              <tbody className="divide-y divide-slate-100">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 ${
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
