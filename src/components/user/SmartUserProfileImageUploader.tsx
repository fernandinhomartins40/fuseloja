
import React from 'react';
import { SmartImageUploader } from '@/components/ui/SmartImageUploader';
import { PendingImage } from '@/types/smartImageUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getUploadProfile } from '@/utils/uploadProfiles';

interface SmartUserProfileImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SmartUserProfileImageUploader: React.FC<SmartUserProfileImageUploaderProps> = ({ 
  imageUrl, 
  onImageChange,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const handleImagesChange = (processedImages: PendingImage[]) => {
    if (processedImages.length > 0) {
      const imageUrl = processedImages[0].croppedUrl || processedImages[0].previewUrl;
      onImageChange(imageUrl);
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
      
      {/* Smart Upload Component */}
      <div className="w-full max-w-sm">
        <SmartImageUploader
          profile={getUploadProfile('avatar')}
          multiple={false}
          onImagesChange={handleImagesChange}
          className="scale-90"
        />
      </div>
      
      <span className="text-xs text-muted-foreground text-center">
        A imagem será automaticamente recortada em formato quadrado
      </span>
    </div>
  );
};
