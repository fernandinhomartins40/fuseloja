import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { CropSettings } from '@/types/imageUpload';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle, 
  XCircle,
  FlipHorizontal,
  FlipVertical,
  Square,
  Maximize
} from 'lucide-react';

interface EnhancedImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  aspectRatio?: number;
  onCrop: (settings: CropSettings) => void;
  presetAspectRatios?: { label: string; value: number }[];
  allowFreeform?: boolean;
  showAdvancedControls?: boolean;
}

export const EnhancedImageCropper: React.FC<EnhancedImageCropperProps> = ({
  isOpen,
  onClose,
  imageUrl,
  aspectRatio,
  onCrop,
  presetAspectRatios = [
    { label: '1:1', value: 1 },
    { label: '16:9', value: 16/9 },
    { label: '4:3', value: 4/3 },
    { label: '3:2', value: 3/2 }
  ],
  allowFreeform = true,
  showAdvancedControls = true
}) => {
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: 1,
    rotate: 0
  });
  
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(aspectRatio || null);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
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

  const handleAspectRatioChange = useCallback((newRatio: number | null) => {
    setSelectedAspectRatio(newRatio);
    
    if (newRatio && cropSettings.width && cropSettings.height) {
      // Adjust crop to match new aspect ratio
      const currentRatio = cropSettings.width / cropSettings.height;
      
      if (Math.abs(currentRatio - newRatio) > 0.1) {
        setCropSettings(prev => {
          let newWidth = prev.width;
          let newHeight = prev.height;
          
          if (newRatio > currentRatio) {
            newHeight = newWidth / newRatio;
          } else {
            newWidth = newHeight * newRatio;
          }
          
          return {
            ...prev,
            width: newWidth,
            height: newHeight
          };
        });
      }
    }
  }, [cropSettings]);

  const handleFlipHorizontal = useCallback(() => {
    setFlipHorizontal(prev => !prev);
  }, []);

  const handleFlipVertical = useCallback(() => {
    setFlipVertical(prev => !prev);
  }, []);

  const handleRotate90 = useCallback(() => {
    setCropSettings(prev => ({ 
      ...prev, 
      rotate: (prev.rotate! + 90) % 360 
    }));
  }, []);

  const handleScaleChange = useCallback((values: number[]) => {
    setCropSettings(prev => ({ ...prev, scale: values[0] }));
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
    const finalSettings = {
      ...cropSettings,
      flipHorizontal,
      flipVertical
    };
    onCrop(finalSettings);
    onClose();
  }, [cropSettings, flipHorizontal, flipVertical, onCrop, onClose]);

  const resetCrop = useCallback(() => {
    setCropSettings({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      scale: 1,
      rotate: 0
    });
    setFlipHorizontal(false);
    setFlipVertical(false);
    setSelectedAspectRatio(aspectRatio || null);
  }, [aspectRatio]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recortar e Editar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Crop Area */}
          <div 
            ref={containerRef}
            className="relative w-full h-96 border rounded-lg overflow-hidden bg-black/5"
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Imagem para recorte"
              className="w-full h-full object-contain select-none"
              style={{
                transform: `scale(${cropSettings.scale}) rotate(${cropSettings.rotate}deg) ${
                  flipHorizontal ? 'scaleX(-1)' : ''
                } ${flipVertical ? 'scaleY(-1)' : ''}`,
                transformOrigin: 'center'
              }}
              draggable={false}
            />
            
            {/* Crop overlay - simplified for brevity, keep existing implementation */}
            {/* Crop overlay */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
              style={{
                left: naturalToDisplay(cropSettings).x,
                top: naturalToDisplay(cropSettings).y,
                width: naturalToDisplay(cropSettings).width,
                height: naturalToDisplay(cropSettings).height
              }}
            >
              {/* Corner resize handles */}
              <div 
                className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize" 
              />
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize"
              />
              <div 
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize"
              />
              <div 
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize"
              />
              
              {/* Edge handles for free-form resizing */}
              <div 
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-n-resize"
              />
              <div 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-s-resize"
              />
              <div 
                className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-w-resize"
              />
              <div 
                className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-e-resize"
              />
            </div>
          </div>
          
          {/* Aspect Ratio Presets */}
          <div className="flex flex-wrap gap-2">
            {allowFreeform && (
              <Button
                variant={selectedAspectRatio === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleAspectRatioChange(null)}
              >
                <Maximize className="w-4 h-4 mr-2" />
                Livre
              </Button>
            )}
            
            {presetAspectRatios.map((preset) => (
              <Button
                key={preset.label}
                variant={selectedAspectRatio === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleAspectRatioChange(preset.value)}
              >
                <Square className="w-4 h-4 mr-2" />
                {preset.label}
              </Button>
            ))}
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zoom Controls */}
            <div className="space-y-2">
              <Label>Zoom</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Slider
                  value={[cropSettings.scale || 1]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={handleScaleChange}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <span className="text-sm min-w-12">
                  {Math.round((cropSettings.scale || 1) * 100)}%
                </span>
              </div>
            </div>

            {/* Transform Controls */}
            {showAdvancedControls && (
              <div className="space-y-2">
                <Label>Transformações</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRotate90}>
                    <RotateCw className="w-4 h-4 mr-2" />
                    90°
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleFlipHorizontal}>
                    <FlipHorizontal className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleFlipVertical}>
                    <FlipVertical className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetCrop}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Crop Info */}
          <div className="text-sm text-muted-foreground">
            Dimensões: {Math.round(cropSettings.width)}×{Math.round(cropSettings.height)}px
            {selectedAspectRatio && (
              <span className="ml-4">
                Proporção: {selectedAspectRatio.toFixed(2)}:1
              </span>
            )}
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
