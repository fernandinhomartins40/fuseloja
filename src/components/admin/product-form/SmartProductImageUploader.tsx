
import React from 'react';
import { SmartImageUploader } from '@/components/ui/SmartImageUploader';
import { PendingImage } from '@/types/smartImageUpload';
import { getUploadProfile } from '@/utils/uploadProfiles';

interface SmartProductImageUploaderProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
}

const SmartProductImageUploader: React.FC<SmartProductImageUploaderProps> = ({
  images,
  mainImage,
  onImagesChange,
  onMainImageChange
}) => {
  const [mainImageProcessed, setMainImageProcessed] = React.useState<PendingImage | null>(null);
  
  const handleMainImageChange = (processedImages: PendingImage[]) => {
    if (processedImages.length > 0) {
      const processedImage = processedImages[0];
      setMainImageProcessed(processedImage);
      
      // Convert processed image to URL
      const imageUrl = processedImage.croppedUrl || processedImage.previewUrl;
      onMainImageChange(imageUrl);
    } else {
      setMainImageProcessed(null);
      onMainImageChange('');
    }
  };

  const handleGalleryImagesChange = (processedImages: PendingImage[]) => {
    const imageUrls = processedImages.map(img => img.croppedUrl || img.previewUrl);
    onImagesChange(imageUrls);
  };

  return (
    <div className="space-y-6">
      {/* Main Product Image */}
      <div>
        <h3 className="text-lg font-medium mb-4">Imagem Principal do Produto</h3>
        <SmartImageUploader
          profile={getUploadProfile('product')}
          multiple={false}
          onImagesChange={handleMainImageChange}
        />
      </div>

      {/* Additional Product Images */}
      <div>
        <h3 className="text-lg font-medium mb-4">Galeria de Imagens</h3>
        <SmartImageUploader
          profile={getUploadProfile('gallery')}
          multiple={true}
          onImagesChange={handleGalleryImagesChange}
        />
      </div>
    </div>
  );
};

export default SmartProductImageUploader;
