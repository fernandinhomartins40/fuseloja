import { useState, useCallback } from 'react';

interface UseFormStateOptions<T> {
  initialData?: T | null;
  onSubmit?: (data: T) => void;
  onCancel?: () => void;
  resetOnSubmit?: boolean;
}

export function useFormState<T extends Record<string, any>>({
  initialData = null,
  onSubmit,
  onCancel,
  resetOnSubmit = false
}: UseFormStateOptions<T>) {
  const [data, setData] = useState<T | null>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => prev ? { ...prev, [field]: value } : null);
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit?.(data);
      if (resetOnSubmit) {
        setData(initialData);
      }
    } catch (error: any) {
      if (typeof error === 'object' && error.fields) {
        setErrors(error.fields);
      } else {
        console.error('Form submission error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [data, isSubmitting, onSubmit, resetOnSubmit, initialData]);

  const handleCancel = useCallback(() => {
    setData(initialData);
    setErrors({});
    onCancel?.();
  }, [initialData, onCancel]);

  const resetForm = useCallback((newData?: T | null) => {
    setData(newData ?? initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    data,
    setData,
    updateField,
    errors,
    setFieldError,
    clearErrors,
    isSubmitting,
    handleSubmit,
    handleCancel,
    resetForm,
    hasErrors: Object.keys(errors).length > 0
  };
}