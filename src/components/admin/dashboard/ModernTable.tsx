
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
        className: 'bg-green-600 text-white hover:bg-green-700' 
      },
      'Enviado': { 
        variant: 'default' as const, 
        className: 'bg-blue-600 text-white hover:bg-blue-700' 
      },
      'Em processamento': { 
        variant: 'default' as const, 
        className: 'bg-yellow-600 text-white hover:bg-yellow-700' 
      },
      'Aguardando pagamento': { 
        variant: 'default' as const, 
        className: 'bg-gray-600 text-white hover:bg-gray-700' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aguardando pagamento'];
    
    return (
      <Badge variant={config.variant} className={`${config.className} transition-colors`}>
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
    <Card className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-500 font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 ${
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
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${
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
