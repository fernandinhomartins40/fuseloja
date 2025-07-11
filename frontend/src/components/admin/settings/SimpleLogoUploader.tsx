
import React from 'react';
import { SimpleImageUploader } from '@/components/ui/SimpleImageUploader';

interface SimpleLogoUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  type?: 'logo' | 'banner';
  dimensions?: string;
  small?: boolean;
}

export const SimpleLogoUploader: React.FC<SimpleLogoUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  type = 'logo',
  dimensions,
  small = false
}) => {
  const aspectRatio = type === 'logo' ? 3/1 : 16/9;
  const maxSize = type === 'logo' ? 2 : 8;
  const placeholder = type === 'logo' ? 'Clique ou arraste o logo aqui' : 'Clique ou arraste o banner aqui';

  return (
    <div className="space-y-2">
      <SimpleImageUploader
        onImageChange={onImageChange}
        currentImage={imageUrl}
        aspectRatio={aspectRatio}
        maxSize={maxSize}
        quality={type === 'logo' ? 95 : 80}
        placeholder={placeholder}
        className={small ? 'max-w-sm' : ''}
      />
      
      {dimensions && (
        <p className="text-xs text-muted-foreground">
          Tamanho recomendado: {dimensions}
        </p>
      )}
    </div>
  );
};
