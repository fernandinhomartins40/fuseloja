
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Check, X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface SimpleCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  aspectRatio?: number;
  onCrop: (croppedBlob: Blob) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SimpleCropper: React.FC<SimpleCropperProps> = ({
  isOpen,
  onClose,
  imageUrl,
  aspectRatio,
  onCrop
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Load image
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      
      // Calculate initial crop area
      const size = Math.min(img.naturalWidth, img.naturalHeight) * 0.8;
      const width = aspectRatio ? size : size;
      const height = aspectRatio ? size / aspectRatio : size;
      
      setCropArea({
        x: (img.naturalWidth - width) / 2,
        y: (img.naturalHeight - height) / 2,
        width,
        height
      });
    };
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
  }, [imageUrl, aspectRatio]);

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image || !containerSize.width) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size to container size
    canvas.width = containerSize.width;
    canvas.height = containerSize.height;
    
    // Calculate display dimensions
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const containerAspect = containerSize.width / containerSize.height;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = containerSize.width;
      displayHeight = containerSize.width / imageAspect;
    } else {
      displayHeight = containerSize.height;
      displayWidth = containerSize.height * imageAspect;
    }

    const offsetX = (containerSize.width - displayWidth) / 2;
    const offsetY = (containerSize.height - displayHeight) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(offsetX + displayWidth / 2, offsetY + displayHeight / 2);
    ctx.scale(scale, scale);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw image
    ctx.drawImage(image, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight);
    ctx.restore();

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate crop area in display coordinates
    const scaleX = displayWidth / image.naturalWidth;
    const scaleY = displayHeight / image.naturalHeight;
    
    const cropX = offsetX + cropArea.x * scaleX * scale;
    const cropY = offsetY + cropArea.y * scaleY * scale;
    const cropWidth = cropArea.width * scaleX * scale;
    const cropHeight = cropArea.height * scaleY * scale;

    // Clear crop area
    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
    
    // Redraw image in crop area
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropX, cropY, cropWidth, cropHeight);
    ctx.clip();
    
    ctx.translate(offsetX + displayWidth / 2, offsetY + displayHeight / 2);
    ctx.scale(scale, scale);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight);
    ctx.restore();

    // Draw crop border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);
    
    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#fff';
    ctx.fillRect(cropX - handleSize / 2, cropY - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(cropX + cropWidth - handleSize / 2, cropY - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(cropX - handleSize / 2, cropY + cropHeight - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(cropX + cropWidth - handleSize / 2, cropY + cropHeight - handleSize / 2, handleSize, handleSize);
    
  }, [image, scale, rotation, cropArea, containerSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !image) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(image.naturalWidth - prev.width, prev.x + dx / scale)),
      y: Math.max(0, Math.min(image.naturalHeight - prev.height, prev.y + dy / scale))
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleCrop = async () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set output size
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    
    // Apply transformations and draw cropped area
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.drawImage(
      image,
      cropArea.x - image.naturalWidth / 2,
      cropArea.y - image.naturalHeight / 2,
      image.naturalWidth,
      image.naturalHeight
    );
    
    ctx.restore();
    
    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Recortar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {/* Canvas Container */}
          <div 
            ref={containerRef}
            className="relative w-full h-96 border rounded-lg overflow-hidden bg-gray-100"
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Zoom */}
            <div className="flex items-center gap-2 flex-1 min-w-48">
              <ZoomOut className="w-4 h-4" />
              <Slider
                value={[scale]}
                onValueChange={handleScaleChange}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4" />
            </div>
            
            {/* Rotate */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Girar
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleCrop}>
              <Check className="w-4 h-4 mr-2" />
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
