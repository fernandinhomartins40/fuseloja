
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { CropSettings } from '@/types/imageUpload';
import { RotateCw, ZoomIn, ZoomOut, CheckCircle, XCircle } from 'lucide-react';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  aspectRatio?: number;
  onCrop: (settings: CropSettings) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  onClose,
  imageUrl,
  aspectRatio = 1,
  onCrop
}) => {
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: 1,
    rotate: 0
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && imageRef.current) {
      const img = imageRef.current;
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const containerAspect = containerRect.width / containerRect.height;
        
        let displayWidth, displayHeight;
        
        if (imgAspect > containerAspect) {
          displayWidth = containerRect.width;
          displayHeight = containerRect.width / imgAspect;
        } else {
          displayHeight = containerRect.height;
          displayWidth = containerRect.height * imgAspect;
        }
        
        const centerX = (containerRect.width - displayWidth) / 2;
        const centerY = (containerRect.height - displayHeight) / 2;
        
        setCropSettings({
          x: centerX + displayWidth * 0.1,
          y: centerY + displayHeight * 0.1,
          width: displayWidth * 0.8,
          height: displayWidth * 0.8 / aspectRatio,
          scale: 1,
          rotate: 0
        });
      }
    }
  }, [isOpen, aspectRatio]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropSettings.x, y: e.clientY - cropSettings.y });
  }, [cropSettings]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - dragStart.x, containerRect.width - cropSettings.width));
    const newY = Math.max(0, Math.min(e.clientY - dragStart.y, containerRect.height - cropSettings.height));
    
    setCropSettings(prev => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart, cropSettings.width, cropSettings.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleScaleChange = useCallback((values: number[]) => {
    setCropSettings(prev => ({ ...prev, scale: values[0] }));
  }, []);

  const handleRotateClick = useCallback(() => {
    setCropSettings(prev => ({ ...prev, rotate: (prev.rotate! + 90) % 360 }));
  }, []);

  const handleZoomIn = useCallback(() => {
    setCropSettings(prev => ({ 
      ...prev, 
      scale: Math.min((prev.scale || 1) + 0.1, 3) 
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCropSettings(prev => ({ 
      ...prev, 
      scale: Math.max((prev.scale || 1) - 0.1, 0.5) 
    }));
  }, []);

  const handleCrop = useCallback(() => {
    onCrop(cropSettings);
    onClose();
  }, [cropSettings, onCrop, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Recortar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="relative w-full h-96 border rounded-lg overflow-hidden bg-black/5"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Imagem para recorte"
              className="w-full h-full object-contain select-none"
              style={{
                transform: `scale(${cropSettings.scale}) rotate(${cropSettings.rotate}deg)`,
                transformOrigin: 'center'
              }}
              draggable={false}
            />
            
            {/* Crop overlay */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
              style={{
                left: cropSettings.x,
                top: cropSettings.y,
                width: cropSettings.width,
                height: cropSettings.height
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Corner handles */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize" />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2 min-w-32">
                <span className="text-sm">Zoom:</span>
                <Slider
                  value={[cropSettings.scale || 1]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={handleScaleChange}
                  className="flex-1"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={handleRotateClick}
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Girar 90°
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleCrop}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Aplicar Recorte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
