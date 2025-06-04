
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
  aspectRatio,
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
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(!!aspectRatio);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate image display dimensions and position
  const getImageDisplayInfo = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return null;
    
    const img = imageRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (imgAspect > containerAspect) {
      displayWidth = containerRect.width;
      displayHeight = containerRect.width / imgAspect;
      offsetX = 0;
      offsetY = (containerRect.height - displayHeight) / 2;
    } else {
      displayHeight = containerRect.height;
      displayWidth = containerRect.height * imgAspect;
      offsetX = (containerRect.width - displayWidth) / 2;
      offsetY = 0;
    }
    
    return { displayWidth, displayHeight, offsetX, offsetY, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
  }, []);

  useEffect(() => {
    if (isOpen && imageRef.current && containerRef.current) {
      const info = getImageDisplayInfo();
      if (info) {
        const { displayWidth, displayHeight, offsetX, offsetY } = info;
        
        // Set initial crop to a reasonable size (60% of image)
        const initialSize = Math.min(displayWidth, displayHeight) * 0.6;
        let cropWidth = initialSize;
        let cropHeight = initialSize;
        
        // Apply aspect ratio if specified and enabled
        if (maintainAspectRatio && aspectRatio) {
          if (aspectRatio > 1) {
            cropHeight = cropWidth / aspectRatio;
          } else {
            cropWidth = cropHeight * aspectRatio;
          }
        }
        
        setCropSettings({
          x: offsetX + (displayWidth - cropWidth) / 2,
          y: offsetY + (displayHeight - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight,
          scale: 1,
          rotate: 0
        });
      }
    }
  }, [isOpen, aspectRatio, maintainAspectRatio, getImageDisplayInfo]);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({ 
      x: e.clientX - cropSettings.x, 
      y: e.clientY - cropSettings.y 
    });
  }, [cropSettings]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const info = getImageDisplayInfo();
    if (!info) return;
    
    const { displayWidth, displayHeight, offsetX, offsetY } = info;
    
    if (isDragging) {
      const newX = Math.max(offsetX, Math.min(e.clientX - dragStart.x, offsetX + displayWidth - cropSettings.width));
      const newY = Math.max(offsetY, Math.min(e.clientY - dragStart.y, offsetY + displayHeight - cropSettings.height));
      
      setCropSettings(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      let newWidth = cropSettings.width;
      let newHeight = cropSettings.height;
      let newX = cropSettings.x;
      let newY = cropSettings.y;
      
      // Minimum size for usability (much smaller than before)
      const minSize = 20;
      
      // Calculate new dimensions based on resize handle
      if (resizeHandle.includes('right')) {
        newWidth = Math.max(minSize, mouseX - cropSettings.x);
        newWidth = Math.min(newWidth, offsetX + displayWidth - cropSettings.x);
      }
      if (resizeHandle.includes('left')) {
        const newLeft = Math.max(offsetX, Math.min(mouseX, cropSettings.x + cropSettings.width - minSize));
        newWidth = cropSettings.x + cropSettings.width - newLeft;
        newX = newLeft;
      }
      if (resizeHandle.includes('bottom')) {
        newHeight = Math.max(minSize, mouseY - cropSettings.y);
        newHeight = Math.min(newHeight, offsetY + displayHeight - cropSettings.y);
      }
      if (resizeHandle.includes('top')) {
        const newTop = Math.max(offsetY, Math.min(mouseY, cropSettings.y + cropSettings.height - minSize));
        newHeight = cropSettings.y + cropSettings.height - newTop;
        newY = newTop;
      }
      
      // Apply aspect ratio constraint only if enabled
      if (maintainAspectRatio && aspectRatio) {
        if (resizeHandle.includes('right') || resizeHandle.includes('left')) {
          newHeight = newWidth / aspectRatio;
          // Adjust if height exceeds bounds
          if (newY + newHeight > offsetY + displayHeight) {
            newHeight = offsetY + displayHeight - newY;
            newWidth = newHeight * aspectRatio;
          }
        } else if (resizeHandle.includes('top') || resizeHandle.includes('bottom')) {
          newWidth = newHeight * aspectRatio;
          // Adjust if width exceeds bounds
          if (newX + newWidth > offsetX + displayWidth) {
            newWidth = offsetX + displayWidth - newX;
            newHeight = newWidth / aspectRatio;
          }
        }
        
        // For corner handles, maintain aspect ratio based on the primary direction
        if (resizeHandle.includes('right') && resizeHandle.includes('bottom')) {
          const ratioFromWidth = newWidth / aspectRatio;
          const ratioFromHeight = newHeight * aspectRatio;
          
          if (Math.abs(newHeight - ratioFromWidth) < Math.abs(newWidth - ratioFromHeight)) {
            newHeight = ratioFromWidth;
          } else {
            newWidth = ratioFromHeight;
          }
        }
      }
      
      // Ensure crop stays within image bounds
      newWidth = Math.min(newWidth, offsetX + displayWidth - newX);
      newHeight = Math.min(newHeight, offsetY + displayHeight - newY);
      newX = Math.max(offsetX, Math.min(newX, offsetX + displayWidth - newWidth));
      newY = Math.max(offsetY, Math.min(newY, offsetY + displayHeight - newHeight));
      
      setCropSettings(prev => ({
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      }));
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, cropSettings, aspectRatio, maintainAspectRatio, getImageDisplayInfo]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
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

  const toggleAspectRatio = useCallback(() => {
    setMaintainAspectRatio(prev => !prev);
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
              onMouseDown={(e) => handleMouseDown(e)}
            >
              {/* Corner resize handles */}
              <div 
                className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize" 
                onMouseDown={(e) => handleMouseDown(e, 'top-left')}
              />
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize"
                onMouseDown={(e) => handleMouseDown(e, 'top-right')}
              />
              <div 
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize"
                onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize"
                onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
              />
              
              {/* Edge handles for free-form resizing */}
              <div 
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-n-resize"
                onMouseDown={(e) => handleMouseDown(e, 'top')}
              />
              <div 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-s-resize"
                onMouseDown={(e) => handleMouseDown(e, 'bottom')}
              />
              <div 
                className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-w-resize"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
              />
              <div 
                className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-e-resize"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
              />
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
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {Math.round(cropSettings.width)}×{Math.round(cropSettings.height)}
              </span>
              
              {aspectRatio && (
                <Button
                  variant={maintainAspectRatio ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAspectRatio}
                  title={maintainAspectRatio ? "Desativar proporção fixa" : "Ativar proporção fixa"}
                >
                  {aspectRatio.toFixed(2)}:1
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotateClick}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Girar 90°
              </Button>
            </div>
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
