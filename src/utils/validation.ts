export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export type ValidationSchema<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

// Common validation rules
export const validationRules = {
  required: <T>(message = 'Este campo é obrigatório'): ValidationRule<T> => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !isNaN(value) && value !== 0;
      if (Array.isArray(value)) return value.length > 0;
      return value != null && value !== undefined;
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => (value?.length || 0) >= min,
    message: message || `Deve ter pelo menos ${min} caracteres`
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => (value?.length || 0) <= max,
    message: message || `Deve ter no máximo ${max} caracteres`
  }),

  email: (message = 'Email inválido'): ValidationRule<string> => ({
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || emailRegex.test(value);
    },
    message
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value >= min,
    message: message || `Deve ser maior ou igual a ${min}`
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value <= max,
    message: message || `Deve ser menor ou igual a ${max}`
  }),

  positive: (message = 'Deve ser um número positivo'): ValidationRule<number> => ({
    validate: (value) => value > 0,
    message
  }),

  url: (message = 'URL inválida'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),

  phone: (message = 'Telefone inválido'): ValidationRule<string> => ({
    validate: (value) => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return !value || phoneRegex.test(value.replace(/\s/g, ''));
    },
    message
  })
};

export function validateField<T>(value: T, rules: ValidationRule<T>[]): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

export function validateObject<T extends Record<string, any>>(
  data: T, 
  schema: ValidationSchema<T>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    if (rules && Array.isArray(rules)) {
      const fieldError = validateField(data[field], rules);
      if (fieldError) {
        errors[field] = fieldError;
      }
    }
  }

  return errors;
}

export function validateAndThrow<T extends Record<string, any>>(
  data: T, 
  schema: ValidationSchema<T>
): void {
  const errors = validateObject(data, schema);
  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }
}