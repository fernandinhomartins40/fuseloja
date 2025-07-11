
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
  };

  const handleBlur = () => {
    onChange(currentColor);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onChange(currentColor);
    }
  };

  const presetColors = [
    '#D90429', '#2B2D42', '#EF233C', '#8D99AE', '#EDF2F4',
    '#05668D', '#028090', '#00A896', '#02C39A', '#F0F3BD',
    '#22223B', '#4A4E69', '#9A8C98', '#C9ADA7', '#F2E9E4',
  ];

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="w-10 h-10 border rounded-md shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
          <Input
            value={currentColor}
            onChange={handleColorChange}
            onBlur={handleBlur}
            className="w-32"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <div className="relative overflow-hidden">
            <Input
              ref={inputRef}
              type="color"
              value={currentColor}
              onChange={handleColorChange}
              onBlur={handleBlur}
              className="h-32 p-0 border-0"
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Cores sugeridas:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {presetColors.map((presetColor, i) => (
                <button
                  key={i}
                  className="w-6 h-6 border rounded-md hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    setCurrentColor(presetColor);
                    onChange(presetColor);
                  }}
                  aria-label={`Selecionar cor ${presetColor}`}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
