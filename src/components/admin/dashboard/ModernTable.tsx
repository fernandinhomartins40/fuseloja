
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
        className: 'bg-green-100 text-green-800 hover:bg-green-200' 
      },
      'Enviado': { 
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
      },
      'Em processamento': { 
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
      },
      'Aguardando pagamento': { 
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aguardando pagamento'];
    
    return (
      <Badge className={`${config.className} text-xs font-medium px-2 py-1`}>
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
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-600">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
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
              <tbody className="divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
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
