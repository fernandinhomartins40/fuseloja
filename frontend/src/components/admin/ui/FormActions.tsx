import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, Plus, Edit } from 'lucide-react';

interface FormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
  submitLabel,
  cancelLabel = 'Cancelar',
  className = ''
}) => {
  const defaultSubmitLabel = isEditing ? 'Atualizar' : 'Adicionar';
  const finalSubmitLabel = submitLabel || defaultSubmitLabel;
  const SubmitIcon = isEditing ? Edit : Plus;

  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
      >
        <X className="h-4 w-4" />
        {cancelLabel}
      </Button>
      
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <SubmitIcon className="h-4 w-4" />
        )}
        {isLoading ? 'Processando...' : finalSubmitLabel}
      </Button>
    </div>
  );
};