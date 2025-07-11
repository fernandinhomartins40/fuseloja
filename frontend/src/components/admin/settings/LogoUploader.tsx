
import React from 'react';
import { UniversalImageUploader } from '@/components/ui/UniversalImageUploader';
import { ProcessedImage } from '@/types/imageUpload';

interface LogoUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  aspectRatio?: string;
  dimensions?: string;
  small?: boolean;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  aspectRatio = "3/1",
  dimensions,
  small = false
}) => {
  const handleImagesChange = (processedImages: ProcessedImage[]) => {
    if (processedImages.length > 0) {
      onImageChange(processedImages[0].dataUrl);
    } else {
      onImageChange('');
    }
  };

  // Convert aspect ratio string to number
  const getAspectRatioNumber = (ratio: string): number => {
    const [width, height] = ratio.split('/').map(Number);
    return width / height;
  };

  return (
    <div className="space-y-2">
      {/* Current Logo Preview */}
      {imageUrl && (
        <div className="mb-4">
          <div 
            className={`border rounded-md overflow-hidden ${small ? 'h-16 w-16' : 'w-full max-w-sm'}`}
            style={{ aspectRatio: aspectRatio }}
          >
            <img 
              src={imageUrl} 
              alt="Logo atual" 
              className="w-full h-full object-contain bg-gray-50"
            />
          </div>
        </div>
      )}
      
      {/* Upload Component */}
      <UniversalImageUploader
        options={{
          multiple: false,
          maxSize: 2,
          allowedFormats: ['image/png', 'image/svg+xml', 'image/jpeg'],
          quality: 95,
          aspectRatio: getAspectRatioNumber(aspectRatio),
          maxWidth: 800,
          maxHeight: 400
        }}
        onImagesChange={handleImagesChange}
      />
      
      {dimensions && (
        <p className="text-xs text-muted-foreground">
          Tamanho recomendado: {dimensions}
        </p>
      )}
    </div>
  );
};
