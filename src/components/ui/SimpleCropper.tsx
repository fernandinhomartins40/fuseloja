
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Check, RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SimpleCropperProps {
  imageUrl: string;
  aspectRatio?: number;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SimpleCropper: React.FC<SimpleCropperProps> = ({
  imageUrl,
  aspectRatio = 1,
  onCropComplete,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Initialize crop area when image loads
  useEffect(() => {
    if (imageLoaded && imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate initial crop size based on container and aspect ratio
      const maxSize = Math.min(containerRect.width * 0.8, containerRect.height * 0.8);
      const cropWidth = Math.min(maxSize, img.offsetWidth * 0.8);
      const cropHeight = cropWidth / aspectRatio;
      
      setCropArea({
        x: (img.offsetWidth - cropWidth) / 2,
        y: (img.offsetHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    }
  }, [imageLoaded, aspectRatio]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
  }, [cropArea]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragStart.x;
    const y = e.clientY - rect.top - dragStart.y;
    
    // Constrain crop area within image bounds
    const maxX = imageRef.current.offsetWidth - cropArea.width;
    const maxY = imageRef.current.offsetHeight - cropArea.height;
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    }));
  }, [isDragging, dragStart, cropArea.width, cropArea.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const adjustScale = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const applyCrop = async () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate scale factors
      const scaleX = img.naturalWidth / imageRef.current!.offsetWidth;
      const scaleY = img.naturalHeight / imageRef.current!.offsetHeight;
      
      // Set canvas size to crop area
      canvas.width = cropArea.width * scaleX;
      canvas.height = cropArea.height * scaleY;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply transformations
      ctx.save();
      
      // Handle rotation
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }
      
      // Apply scale
      if (scale !== 1) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
      }
      
      // Draw cropped portion
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      ctx.restore();
      
      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl);
        }
      }, 'image/jpeg', 0.85);
    };
    
    img.src = imageUrl;
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Recortar Imagem</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={applyCrop}>
                <Check className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
          
          {/* Tools */}
          <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => adjustScale(-0.1)}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => adjustScale(0.1)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={rotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
            <span className="text-sm text-gray-600">
              <Move className="h-4 w-4 inline mr-1" />
              Arraste para posicionar
            </span>
          </div>
          
          {/* Crop Area */}
          <div 
            ref={containerRef}
            className="flex-1 flex items-center justify-center p-4 bg-black/90 overflow-auto"
          >
            <div className="relative">
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Para recortar"
                onLoad={handleImageLoad}
                className="max-w-full max-h-full object-contain"
                style={{ 
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              
              {/* Crop Overlay */}
              {imageLoaded && (
                <>
                  {/* Darken outside crop area */}
                  <div 
                    className="absolute inset-0 bg-black/50 pointer-events-none"
                    style={{
                      clipPath: `polygon(
                        0% 0%, 
                        0% 100%, 
                        ${cropArea.x}px 100%, 
                        ${cropArea.x}px ${cropArea.y}px, 
                        ${cropArea.x + cropArea.width}px ${cropArea.y}px, 
                        ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px, 
                        ${cropArea.x}px ${cropArea.y + cropArea.height}px, 
                        ${cropArea.x}px 100%, 
                        100% 100%, 
                        100% 0%
                      )`
                    }}
                  />
                  
                  {/* Crop rectangle */}
                  <div
                    className="absolute border-2 border-white cursor-move bg-transparent"
                    style={{
                      left: cropArea.x,
                      top: cropArea.y,
                      width: cropArea.width,
                      height: cropArea.height
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {/* Corner handles */}
                    <div className="absolute w-3 h-3 bg-white border border-gray-400 -top-1 -left-1" />
                    <div className="absolute w-3 h-3 bg-white border border-gray-400 -top-1 -right-1" />
                    <div className="absolute w-3 h-3 bg-white border border-gray-400 -bottom-1 -left-1" />
                    <div className="absolute w-3 h-3 bg-white border border-gray-400 -bottom-1 -right-1" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};
