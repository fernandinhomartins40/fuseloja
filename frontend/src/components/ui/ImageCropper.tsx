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
        const { displayWidth, displayHeight, offsetX, offsetY, naturalWidth, naturalHeight } = info;
        
        // Set initial crop to a reasonable size (60% of image) in natural coordinates
        const cropRatio = 0.6;
        let cropWidth = naturalWidth * cropRatio;
        let cropHeight = naturalHeight * cropRatio;
        
        // Apply aspect ratio if specified and enabled
        if (maintainAspectRatio && aspectRatio) {
          if (aspectRatio > 1) {
            cropHeight = cropWidth / aspectRatio;
          } else {
            cropWidth = cropHeight * aspectRatio;
          }
          
          // Ensure crop fits within image bounds
          if (cropWidth > naturalWidth) {
            cropWidth = naturalWidth;
            cropHeight = cropWidth / aspectRatio;
          }
          if (cropHeight > naturalHeight) {
            cropHeight = naturalHeight;
            cropWidth = cropHeight * aspectRatio;
          }
        }
        
        // Center the crop in natural image coordinates
        const cropX = (naturalWidth - cropWidth) / 2;
        const cropY = (naturalHeight - cropHeight) / 2;
        
        setCropSettings({
          x: cropX,
          y: cropY,
          width: cropWidth,
          height: cropHeight,
          scale: 1,
          rotate: 0
        });
      }
    }
  }, [isOpen, aspectRatio, maintainAspectRatio, getImageDisplayInfo]);

  // Convert natural coordinates to display coordinates for rendering
  const naturalToDisplay = useCallback((naturalCoords: { x: number, y: number, width: number, height: number }) => {
    const info = getImageDisplayInfo();
    if (!info) return naturalCoords;
    
    const { displayWidth, displayHeight, offsetX, offsetY, naturalWidth, naturalHeight } = info;
    const scaleX = displayWidth / naturalWidth;
    const scaleY = displayHeight / naturalHeight;
    
    return {
      x: naturalCoords.x * scaleX + offsetX,
      y: naturalCoords.y * scaleY + offsetY,
      width: naturalCoords.width * scaleX,
      height: naturalCoords.height * scaleY
    };
  }, [getImageDisplayInfo]);

  // Convert display coordinates to natural coordinates
  const displayToNatural = useCallback((displayCoords: { x: number, y: number, width: number, height: number }) => {
    const info = getImageDisplayInfo();
    if (!info) return displayCoords;
    
    const { displayWidth, displayHeight, offsetX, offsetY, naturalWidth, naturalHeight } = info;
    const scaleX = naturalWidth / displayWidth;
    const scaleY = naturalHeight / displayHeight;
    
    return {
      x: (displayCoords.x - offsetX) * scaleX,
      y: (displayCoords.y - offsetY) * scaleY,
      width: displayCoords.width * scaleX,
      height: displayCoords.height * scaleY
    };
  }, [getImageDisplayInfo]);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      setIsDragging(true);
    }
    
    const displayCoords = naturalToDisplay(cropSettings);
    setDragStart({ 
      x: e.clientX - displayCoords.x, 
      y: e.clientY - displayCoords.y 
    });
  }, [cropSettings, naturalToDisplay]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const info = getImageDisplayInfo();
    if (!info) return;
    
    const { displayWidth, displayHeight, offsetX, offsetY, naturalWidth, naturalHeight } = info;
    
    const displayCoords = naturalToDisplay(cropSettings);
    
    if (isDragging) {
      const newDisplayX = Math.max(offsetX, Math.min(e.clientX - dragStart.x, offsetX + displayWidth - displayCoords.width));
      const newDisplayY = Math.max(offsetY, Math.min(e.clientY - dragStart.y, offsetY + displayHeight - displayCoords.height));
      
      const naturalCoords = displayToNatural({
        x: newDisplayX,
        y: newDisplayY,
        width: displayCoords.width,
        height: displayCoords.height
      });
      
      setCropSettings(prev => ({ ...prev, x: naturalCoords.x, y: naturalCoords.y }));
    } else if (isResizing) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      let newDisplayWidth = displayCoords.width;
      let newDisplayHeight = displayCoords.height;
      let newDisplayX = displayCoords.x;
      let newDisplayY = displayCoords.y;
      
      // Minimum size for usability
      const minDisplaySize = 20;
      
      // Calculate new dimensions based on resize handle
      if (resizeHandle.includes('right')) {
        newDisplayWidth = Math.max(minDisplaySize, mouseX - displayCoords.x);
        newDisplayWidth = Math.min(newDisplayWidth, offsetX + displayWidth - displayCoords.x);
      }
      if (resizeHandle.includes('left')) {
        const newLeft = Math.max(offsetX, Math.min(mouseX, displayCoords.x + displayCoords.width - minDisplaySize));
        newDisplayWidth = displayCoords.x + displayCoords.width - newLeft;
        newDisplayX = newLeft;
      }
      if (resizeHandle.includes('bottom')) {
        newDisplayHeight = Math.max(minDisplaySize, mouseY - displayCoords.y);
        newDisplayHeight = Math.min(newDisplayHeight, offsetY + displayHeight - displayCoords.y);
      }
      if (resizeHandle.includes('top')) {
        const newTop = Math.max(offsetY, Math.min(mouseY, displayCoords.y + displayCoords.height - minDisplaySize));
        newDisplayHeight = displayCoords.y + displayCoords.height - newTop;
        newDisplayY = newTop;
      }
      
      // Apply aspect ratio constraint only if enabled
      if (maintainAspectRatio && aspectRatio) {
        if (resizeHandle.includes('right') || resizeHandle.includes('left')) {
          newDisplayHeight = newDisplayWidth / aspectRatio;
          // Adjust if height exceeds bounds
          if (newDisplayY + newDisplayHeight > offsetY + displayHeight) {
            newDisplayHeight = offsetY + displayHeight - newDisplayY;
            newDisplayWidth = newDisplayHeight * aspectRatio;
          }
        } else if (resizeHandle.includes('top') || resizeHandle.includes('bottom')) {
          newDisplayWidth = newDisplayHeight * aspectRatio;
          // Adjust if width exceeds bounds
          if (newDisplayX + newDisplayWidth > offsetX + displayWidth) {
            newDisplayWidth = offsetX + displayWidth - newDisplayX;
            newDisplayHeight = newDisplayWidth / aspectRatio;
          }
        }
        
        // For corner handles, maintain aspect ratio based on the primary direction
        if (resizeHandle.includes('right') && resizeHandle.includes('bottom')) {
          const ratioFromWidth = newDisplayWidth / aspectRatio;
          const ratioFromHeight = newDisplayHeight * aspectRatio;
          
          if (Math.abs(newDisplayHeight - ratioFromWidth) < Math.abs(newDisplayWidth - ratioFromHeight)) {
            newDisplayHeight = ratioFromWidth;
          } else {
            newDisplayWidth = ratioFromHeight;
          }
        }
      }
      
      // Ensure crop stays within image bounds
      newDisplayWidth = Math.min(newDisplayWidth, offsetX + displayWidth - newDisplayX);
      newDisplayHeight = Math.min(newDisplayHeight, offsetY + displayHeight - newDisplayY);
      newDisplayX = Math.max(offsetX, Math.min(newDisplayX, offsetX + displayWidth - newDisplayWidth));
      newDisplayY = Math.max(offsetY, Math.min(newDisplayY, offsetY + displayHeight - newDisplayHeight));
      
      // Convert back to natural coordinates
      const naturalCoords = displayToNatural({
        x: newDisplayX,
        y: newDisplayY,
        width: newDisplayWidth,
        height: newDisplayHeight
      });
      
      setCropSettings(prev => ({
        ...prev,
        x: naturalCoords.x,
        y: naturalCoords.y,
        width: naturalCoords.width,
        height: naturalCoords.height
      }));
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, cropSettings, aspectRatio, maintainAspectRatio, getImageDisplayInfo, naturalToDisplay, displayToNatural]);

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
    // Pass natural coordinates directly to the processing function
    onCrop(cropSettings);
    onClose();
  }, [cropSettings, onCrop, onClose]);

  const displayCoords = naturalToDisplay(cropSettings);

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
                left: displayCoords.x,
                top: displayCoords.y,
                width: displayCoords.width,
                height: displayCoords.height
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
