
import React, { useState, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Image as ImageIcon, 
  Upload, 
  Crop, 
  Trash2, 
  XCircle, 
  CheckCircle, 
  GalleryHorizontal 
} from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  mainImage: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (image: string) => void;
}

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images = [],
  mainImage,
  onImagesChange,
  onMainImageChange
}) => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [cropAspectRatio, setCropAspectRatio] = useState(1);
  const [tempCroppedImage, setTempCroppedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setCropImage(event.target.result as string);
          setShowCropDialog(true);
        }
      };
      
      reader.readAsDataURL(file);
      
      // Clear input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle crop action
  const handleCrop = useCallback(() => {
    if (!imageRef.current || !cropCanvasRef.current) return;
    
    const image = imageRef.current;
    const canvas = cropCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simple center crop
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    const startX = (image.naturalWidth - size) / 2;
    const startY = (image.naturalHeight - size) / 2;
    
    canvas.width = size;
    canvas.height = size;
    
    ctx.drawImage(
      image,
      startX, startY,
      size, size,
      0, 0,
      canvas.width, canvas.height
    );
    
    // Apply quality compression
    const croppedImage = canvas.toDataURL('image/jpeg', quality / 100);
    setTempCroppedImage(croppedImage);
  }, [quality]);

  // Save cropped image
  const saveCroppedImage = () => {
    if (tempCroppedImage) {
      const newImages = [...images, tempCroppedImage];
      onImagesChange(newImages);
      
      // If this is the first image, set it as the main image
      if (images.length === 0) {
        onMainImageChange(tempCroppedImage);
      }
      
      // Reset crop state
      setShowCropDialog(false);
      setCropImage(null);
      setTempCroppedImage(null);
    }
  };

  // Set an image as the main image
  const setAsMain = (image: string) => {
    onMainImageChange(image);
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const removedImage = newImages.splice(index, 1)[0];
    onImagesChange(newImages);
    
    // If the main image was removed, set a new one if available
    if (removedImage === mainImage && newImages.length > 0) {
      onMainImageChange(newImages[0]);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <GalleryHorizontal size={16} />
            Galeria
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload size={16} />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="pt-4">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/30">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma imagem adicionada</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="mr-2" />
                Fazer Upload
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Imagem Principal</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} className="mr-2" />
                  Adicionar
                </Button>
              </div>
              
              {/* Main image */}
              <div className="mb-4 border rounded-md overflow-hidden">
                <AspectRatio ratio={1 / 1} className="bg-muted/30">
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt="Imagem principal"
                      className="w-full h-full object-cover"
                    />
                  )}
                </AspectRatio>
              </div>
              
              <h4 className="text-sm font-medium mb-2">Galeria de Imagens</h4>
              
              {/* Image gallery */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative group border rounded-md overflow-hidden ${
                      image === mainImage ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <AspectRatio ratio={1 / 1} className="bg-muted/30">
                      <img
                        src={image}
                        alt={`Produto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {image !== mainImage && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setAsMain(image)}
                          title="Definir como principal"
                          className="h-8 w-8 bg-white/80 hover:bg-white"
                        >
                          <CheckCircle size={16} />
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(index)}
                        title="Remover imagem"
                        className="h-8 w-8"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="pt-4">
          <div 
            className="border-dashed border-2 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-center mb-1 font-medium">
              Clique ou arraste para fazer upload
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Suporte para JPG, PNG ou WEBP (Máx. 5MB)
            </p>
            
            <Input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Imagem</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Tabs for crop and preview */}
            <Tabs defaultValue="crop" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crop">
                  <Crop size={16} className="mr-2" />
                  Cortar
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <ImageIcon size={16} className="mr-2" />
                  Visualizar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="crop" className="flex flex-col items-center">
                <div className="relative w-full max-w-sm mx-auto my-4 border rounded-md overflow-hidden">
                  <AspectRatio ratio={1 / 1}>
                    {cropImage && (
                      <img
                        ref={imageRef}
                        src={cropImage}
                        alt="Imagem para corte"
                        className="w-full h-full object-contain"
                        onLoad={handleCrop}
                      />
                    )}
                  </AspectRatio>
                </div>
                
                <canvas ref={cropCanvasRef} className="hidden" />
                
                <div className="w-full max-w-sm mx-auto space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Qualidade da Imagem</span>
                      <span className="text-sm font-medium">{quality}%</span>
                    </div>
                    <Slider
                      value={[quality]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(values) => {
                        setQuality(values[0]);
                        handleCrop();
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="flex flex-col items-center">
                <div className="w-full max-w-sm mx-auto my-4 border rounded-md overflow-hidden">
                  <AspectRatio ratio={1 / 1} className="bg-muted/30">
                    {tempCroppedImage && (
                      <img
                        src={tempCroppedImage}
                        alt="Prévia da imagem"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </AspectRatio>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-end">
            <Button 
              variant="outline"
              onClick={() => {
                setShowCropDialog(false);
                setCropImage(null);
                setTempCroppedImage(null);
              }}
            >
              <XCircle size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button onClick={saveCroppedImage}>
              <CheckCircle size={16} className="mr-2" />
              Salvar Imagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageUploader;
