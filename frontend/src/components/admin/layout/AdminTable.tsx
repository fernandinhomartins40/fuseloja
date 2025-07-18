import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  onClick: (row: any) => void;
  variant?: 'default' | 'secondary' | 'destructive';
  icon?: React.ReactNode;
}

interface AdminTableProps {
  columns: TableColumn[];
  data: any[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: TableAction[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  actions,
  emptyMessage = "Nenhum item encontrado",
  isLoading = false
}) => {
  const renderCellValue = (column: TableColumn, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    // Default rendering for common data types
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Ativo' : 'Inativo'}
        </Badge>
      );
    }
    
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    
    return String(value);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Table Header with Search and Actions */}
      {(onSearchChange || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {onSearchChange && (
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1 sm:flex-none justify-center">
              <Filter className="h-4 w-4" />
              <span className="hidden xs:inline">Filtros</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1 sm:flex-none justify-center">
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Exportar</span>
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                  >
                    {column.label}
                  </TableHead>
                ))}
                {actions && actions.length > 0 && (
                  <TableHead className="w-[80px] sm:w-[100px] text-center font-semibold text-gray-900 text-xs sm:text-sm px-2 sm:px-4">
                    Ações
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-6 sm:py-8">
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-gray-600 text-sm">Carregando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-6 sm:py-8">
                    <div className="text-gray-500">
                      <p className="text-sm">{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <TableCell key={column.key} className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">
                        {renderCellValue(column, row)}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell className="text-center px-2 sm:px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() => action.onClick(row)}
                                className={
                                  action.variant === 'destructive'
                                    ? 'text-red-600 focus:text-red-600'
                                    : ''
                                }
                              >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};