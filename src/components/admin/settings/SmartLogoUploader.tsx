
import React from 'react';
import { SmartImageUploader } from '@/components/ui/SmartImageUploader';
import { PendingImage } from '@/types/smartImageUpload';
import { getUploadProfile } from '@/utils/uploadProfiles';

interface SmartLogoUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  type?: 'logo' | 'banner';
  dimensions?: string;
  small?: boolean;
}

export const SmartLogoUploader: React.FC<SmartLogoUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  type = 'logo',
  dimensions,
  small = false
}) => {
  const profile = getUploadProfile(type);

  const handleImagesChange = (processedImages: PendingImage[]) => {
    if (processedImages.length > 0) {
      const processedUrl = processedImages[0].croppedUrl || processedImages[0].previewUrl;
      onImageChange(processedUrl);
    } else {
      onImageChange('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Current Logo Preview */}
      {imageUrl && (
        <div className="mb-4">
          <div 
            className={`border rounded-md overflow-hidden ${small ? 'h-16 w-48' : 'w-full max-w-sm'}`}
            style={{ aspectRatio: profile.aspectRatio }}
          >
            <img 
              src={imageUrl} 
              alt="Logo atual" 
              className="w-full h-full object-contain bg-gray-50"
            />
          </div>
        </div>
      )}
      
      {/* Smart Upload Component */}
      <SmartImageUploader
        profile={profile}
        multiple={false}
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
