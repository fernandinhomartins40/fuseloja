
import React from 'react';
import { UniversalImageUploader } from '@/components/ui/UniversalImageUploader';
import { ProcessedImage } from '@/types/imageUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserProfileImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const UserProfileImageUploader: React.FC<UserProfileImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const handleImagesChange = (processedImages: ProcessedImage[]) => {
    if (processedImages.length > 0) {
      onImageChange(processedImages[0].dataUrl);
    } else {
      onImageChange('');
    }
  };

  const getInitials = () => {
    return 'U';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Current Avatar Display */}
      <Avatar className={`${sizeClasses[size]} border-2 border-primary`}>
        <AvatarImage src={imageUrl} alt="Foto de perfil" />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      
      {/* Upload Component */}
      <div className="w-full max-w-sm">
        <UniversalImageUploader
          options={{
            multiple: false,
            maxSize: 3,
            allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
            quality: 90,
            aspectRatio: 1,
            maxWidth: 400,
            maxHeight: 400
          }}
          onImagesChange={handleImagesChange}
          className="scale-90"
        />
      </div>
      
      <span className="text-xs text-muted-foreground text-center">
        Recomendado: imagem quadrada de 400x400px
      </span>
    </div>
  );
};
