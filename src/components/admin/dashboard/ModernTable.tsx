
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
        variant: 'default' as const, 
        className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25' 
      },
      'Enviado': { 
        variant: 'default' as const, 
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25' 
      },
      'Em processamento': { 
        variant: 'default' as const, 
        className: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25' 
      },
      'Aguardando pagamento': { 
        variant: 'default' as const, 
        className: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 shadow-lg shadow-slate-500/25' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aguardando pagamento'];
    
    return (
      <Badge variant={config.variant} className={`${config.className} transition-all duration-200 transform hover:scale-105`}>
        {status}
      </Badge>
    );
  };

  const renderCellContent = (value: any, key: string) => {
    if (key === 'status') {
      return getStatusBadge(value);
    }
    return value;
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 group overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <div className="w-2 h-2 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-slate-500 font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-purple-50/30">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200/60 ${
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
              <tbody className="bg-white divide-y divide-slate-100">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/20 transition-all duration-200 group/row">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-slate-700 transition-colors duration-200 ${
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
        <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl" />
      </CardContent>
    </Card>
  );
};
