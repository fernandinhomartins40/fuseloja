
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
    '#3B82F6', '#EC4899', '#10B981', '#EF4444', '#8B5CF6',
    '#F59E0B', '#06B6D4', '#84CC16', '#F97316', '#14B8A6',
    '#6366F1', '#D946EF', '#059669', '#DC2626', '#7C3AED',
    '#CA8A04', '#0891B2', '#65A30D', '#EA580C', '#0D9488',
  ];

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
          <div
            className="w-10 h-10 border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            style={{ backgroundColor: currentColor }}
            title={`Cor atual: ${currentColor}`}
          />
          <Input
            value={currentColor}
            onChange={handleColorChange}
            onBlur={handleBlur}
            className="w-32 font-mono text-sm"
            placeholder="#000000"
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
