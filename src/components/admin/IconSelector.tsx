
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { iconComponents, IconName } from '@/utils/categoryIcons';
import { Check, Search } from 'lucide-react';

interface IconSelectorProps {
  value: IconName | string;
  onChange: (value: IconName) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const iconNames = Object.keys(iconComponents) as IconName[];
  
  const filteredIcons = iconNames.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  const IconComponent = value ? iconComponents[value as IconName] : null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            {value && IconComponent && <IconComponent className="h-5 w-5" />}
            <span>{value || "Selecione um ícone"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Buscar ícones..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-72">
          <div className="grid grid-cols-4 gap-1 p-2">
            {filteredIcons.map(iconName => {
              const Icon = iconComponents[iconName];
              const isSelected = value === iconName;
              
              return (
                <Button
                  key={iconName}
                  variant="ghost"
                  className={`relative h-14 justify-start flex-col items-center ${
                    isSelected ? 'bg-accent' : ''
                  }`}
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                >
                  {isSelected && (
                    <Check className="h-4 w-4 absolute top-1 right-1 text-primary" />
                  )}
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1 truncate w-full text-center">
                    {iconName}
                  </span>
                </Button>
              );
            })}
            {filteredIcons.length === 0 && (
              <div className="col-span-4 h-24 flex items-center justify-center text-muted-foreground">
                Nenhum ícone encontrado
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
