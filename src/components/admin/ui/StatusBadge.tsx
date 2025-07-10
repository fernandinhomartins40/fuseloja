import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'pending' 
  | 'inactive'
  | 'processing'
  | 'delivered'
  | 'cancelled'
  | 'shipped'
  | 'active';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { 
  text: string; 
  className: string; 
  dot?: boolean;
}> = {
  success: {
    text: 'Sucesso',
    className: 'bg-green-100 text-green-800 border-green-200',
    dot: true
  },
  warning: {
    text: 'Atenção',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dot: true
  },
  error: {
    text: 'Erro',
    className: 'bg-red-100 text-red-800 border-red-200',
    dot: true
  },
  info: {
    text: 'Informação',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: true
  },
  pending: {
    text: 'Pendente',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
    dot: true
  },
  inactive: {
    text: 'Inativo',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    dot: true
  },
  processing: {
    text: 'Processando',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: true
  },
  delivered: {
    text: 'Entregue',
    className: 'bg-green-100 text-green-800 border-green-200',
    dot: true
  },
  cancelled: {
    text: 'Cancelado',
    className: 'bg-red-100 text-red-800 border-red-200',
    dot: true
  },
  shipped: {
    text: 'Enviado',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    dot: true
  },
  active: {
    text: 'Ativo',
    className: 'bg-green-100 text-green-800 border-green-200',
    dot: true
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  className 
}) => {
  const config = statusConfig[status];
  const displayText = text || config.text;

  return (
    <Badge 
      variant="outline"
      className={cn(
        'text-xs font-medium px-2.5 py-1 rounded-full border',
        config.className,
        className
      )}
    >
      {config.dot && (
        <div className={cn(
          'w-1.5 h-1.5 rounded-full mr-2',
          status === 'success' || status === 'active' || status === 'delivered' ? 'bg-green-500' :
          status === 'warning' || status === 'pending' ? 'bg-yellow-500' :
          status === 'error' || status === 'cancelled' ? 'bg-red-500' :
          status === 'info' || status === 'processing' ? 'bg-blue-500' :
          status === 'shipped' ? 'bg-purple-500' :
          'bg-gray-500'
        )} />
      )}
      {displayText}
    </Badge>
  );
};