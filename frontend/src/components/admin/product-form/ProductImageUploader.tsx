
import React from 'react';
import { UniversalImageUploader } from '@/components/ui/UniversalImageUploader';
import { ProcessedImage } from '@/types/imageUpload';

interface ProductImageUploaderProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
}

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images,
  mainImage,
  onImagesChange,
  onMainImageChange
}) => {
  const handleImagesChange = (processedImages: ProcessedImage[]) => {
    const imageUrls = processedImages.map(img => img.dataUrl);
    onImagesChange(imageUrls);
  };

  const handleMainImageChange = (processedImage: ProcessedImage | null) => {
    if (processedImage) {
      onMainImageChange(processedImage.dataUrl);
    }
  };

  // Convert existing string URLs to ProcessedImage format for compatibility
  const convertToProcessedImages = (urls: string[]): ProcessedImage[] => {
    return urls.map((url, index) => ({
      id: `existing_${index}`,
      originalFile: new File([], 'existing'),
      processedBlob: new Blob(),
      dataUrl: url,
      width: 400,
      height: 400,
      size: 0,
      format: 'image/jpeg'
    }));
  };

  const initialImages = convertToProcessedImages(images);
  const initialMainImage = mainImage ? convertToProcessedImages([mainImage])[0] : null;

  return (
    <UniversalImageUploader
      options={{
        multiple: true,
        maxSize: 5,
        allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
        quality: 85,
        aspectRatio: 1
      }}
      onImagesChange={handleImagesChange}
      onMainImageChange={handleMainImageChange}
      initialImages={initialImages}
      initialMainImage={initialMainImage}
    />
  );
};

export default ProductImageUploader;
