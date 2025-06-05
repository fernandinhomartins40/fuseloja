
export interface ValidationRule {
  check: (file: File) => boolean;
  message: string;
}

export interface ValidationOptions {
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  allowedFormats?: string[];
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  aspectRatioTolerance?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ImageValidator {
  private rules: ValidationRule[] = [];
  
  constructor(private options: ValidationOptions = {}) {
    this.setupRules();
  }
  
  private setupRules() {
    const { 
      maxSize, 
      minSize, 
      allowedFormats, 
      maxWidth, 
      maxHeight, 
      minWidth, 
      minHeight,
      aspectRatio,
      aspectRatioTolerance = 0.1
    } = this.options;
    
    // File size validation
    if (maxSize) {
      this.rules.push({
        check: (file) => file.size <= maxSize,
        message: `Arquivo muito grande. Máximo: ${this.formatBytes(maxSize)}`
      });
    }
    
    if (minSize) {
      this.rules.push({
        check: (file) => file.size >= minSize,
        message: `Arquivo muito pequeno. Mínimo: ${this.formatBytes(minSize)}`
      });
    }
    
    // Format validation
    if (allowedFormats?.length) {
      this.rules.push({
        check: (file) => allowedFormats.includes(file.type),
        message: `Formato não suportado. Use: ${allowedFormats.join(', ')}`
      });
    }
  }
  
  async validate(file: File): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Run basic file validation rules
    for (const rule of this.rules) {
      if (!rule.check(file)) {
        errors.push(rule.message);
      }
    }
    
    // Image dimension validation (requires loading the image)
    if (this.options.maxWidth || this.options.maxHeight || this.options.minWidth || this.options.minHeight || this.options.aspectRatio) {
      try {
        const dimensions = await this.getImageDimensions(file);
        
        if (this.options.maxWidth && dimensions.width > this.options.maxWidth) {
          errors.push(`Largura muito grande. Máximo: ${this.options.maxWidth}px`);
        }
        
        if (this.options.maxHeight && dimensions.height > this.options.maxHeight) {
          errors.push(`Altura muito grande. Máximo: ${this.options.maxHeight}px`);
        }
        
        if (this.options.minWidth && dimensions.width < this.options.minWidth) {
          errors.push(`Largura muito pequena. Mínimo: ${this.options.minWidth}px`);
        }
        
        if (this.options.minHeight && dimensions.height < this.options.minHeight) {
          errors.push(`Altura muito pequena. Mínimo: ${this.options.minHeight}px`);
        }
        
        if (this.options.aspectRatio) {
          const imageRatio = dimensions.width / dimensions.height;
          const tolerance = this.options.aspectRatioTolerance || 0.1;
          
          if (Math.abs(imageRatio - this.options.aspectRatio) > tolerance) {
            warnings.push(`Proporção recomendada: ${this.options.aspectRatio.toFixed(2)}:1`);
          }
        }
      } catch (error) {
        errors.push('Não foi possível analisar as dimensões da imagem');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
  
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Convenience function for quick validation
export const validateImage = async (file: File, options: ValidationOptions = {}): Promise<ValidationResult> => {
  const validator = new ImageValidator(options);
  return validator.validate(file);
};
