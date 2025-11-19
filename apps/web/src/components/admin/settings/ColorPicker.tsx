
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
    <div className="space-y-3">
      {/* Color preview and input */}
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
        <div
          className="w-12 h-12 border-2 border-gray-300 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all"
          style={{ backgroundColor: currentColor }}
          title={`Cor atual: ${currentColor}`}
          onClick={() => setIsOpen(true)}
        />
        <div className="flex-1">
          <Input
            value={currentColor}
            onChange={handleColorChange}
            onBlur={handleBlur}
            className="w-full font-mono text-sm"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Color picker popover */}
      <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <button className="w-full px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors">
            Escolher cor
          </button>
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

      {/* Quick color selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Cores rápidas:</p>
        <div className="grid grid-cols-10 gap-2">
          {presetColors.map((presetColor, i) => (
            <button
              key={i}
              className="w-8 h-8 border-2 border-gray-200 rounded-md hover:scale-110 transition-transform shadow-sm hover:shadow-md"
              style={{ backgroundColor: presetColor }}
              onClick={() => {
                setCurrentColor(presetColor);
                onChange(presetColor);
              }}
              title={`Selecionar cor ${presetColor}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
