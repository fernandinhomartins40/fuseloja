import React from 'react';
import { UnifiedImageUploader, DEFAULT_PROFILES } from '@/components/ui/unified-image-uploader';

interface UnifiedLogoUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  type?: 'logo' | 'banner';
  dimensions?: string;
  small?: boolean;
}

export const UnifiedLogoUploader: React.FC<UnifiedLogoUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  type = 'logo',
  dimensions,
  small = false
}) => {
  const profile = type === 'logo' ? DEFAULT_PROFILES.logo : DEFAULT_PROFILES.banner;
  const placeholder = type === 'logo' ? 'Clique ou arraste o logo aqui' : 'Clique ou arraste o banner aqui';

  return (
    <div className="space-y-2">
      <div className={small ? 'max-w-sm' : ''}>
        <UnifiedImageUploader
          profile={profile}
          multiple={false}
          currentImages={imageUrl ? [imageUrl] : []}
          onImagesChange={(urls) => onImageChange(urls[0] || '')}
          onSingleImageChange={onImageChange}
          placeholder={placeholder}
        />
      </div>
      
      {dimensions && (
        <p className="text-xs text-muted-foreground">
          Tamanho recomendado: {dimensions}
        </p>
      )}
    </div>
  );
};