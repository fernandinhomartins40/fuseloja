
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IconSelectorProps {
  value: IconName | string;
  onChange: (value: IconName) => void;
}

// Icon categories for better organization
const iconCategories = {
  'Interface': ['ArrowRight', 'ArrowLeft', 'Check', 'X', 'Plus', 'Minus', 'Search', 'Settings', 'User', 'Home', 'Menu'],
  'E-commerce': ['ShoppingBag', 'ShoppingCart', 'CreditCard', 'Package', 'Truck', 'Tag', 'Tags', 'Shirt', 'Smartphone', 'Laptop'],
  'Media': ['Image', 'Video', 'Music', 'Headphones', 'Speaker', 'Play', 'Pause', 'Camera', 'Film', 'Mic'],
  'Communication': ['Mail', 'MessageSquare', 'Phone', 'Share', 'Send', 'Bell', 'Heart', 'Star', 'Flag', 'MessageCircle'],
  'Business': ['FileText', 'Briefcase', 'Calendar', 'Clock', 'PieChart', 'BarChart', 'DollarSign', 'Percent', 'TrendingUp', 'TrendingDown'],
  'Outros': [] // Will hold all other icons not in a specific category
};

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('todos');

  const iconNames = Object.keys(iconComponents) as IconName[];
  
  // Organize icons into categories
  const categorizedIcons = React.useMemo(() => {
    // Add uncategorized icons to "Outros"
    const categorizedMap: Record<string, IconName[]> = { ...iconCategories };
    
    // Add all icons to "Outros" that aren't assigned to a specific category
    const assignedIcons = Object.values(iconCategories).flat();
    categorizedMap['Outros'] = iconNames.filter(name => 
      !assignedIcons.includes(name as IconName)
    );
    
    return categorizedMap;
  }, [iconNames]);

  // Filter icons based on search
  const filteredIcons = React.useMemo(() => {
    if (!search) {
      return activeTab === 'todos' 
        ? iconNames 
        : categorizedIcons[activeTab] || [];
    }
    
    const searchLower = search.toLowerCase();
    const icons = activeTab === 'todos' 
      ? iconNames 
      : (categorizedIcons[activeTab] || []);
      
    return icons.filter(name => 
      name.toLowerCase().includes(searchLower)
    );
  }, [search, activeTab, iconNames, categorizedIcons]);

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
      <PopoverContent className="w-[340px] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Buscar ícones..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="h-8 border-b">
            <TabsList className="bg-transparent p-0 h-8">
              <TabsTrigger value="todos" className="h-8 px-3">Todos</TabsTrigger>
              {Object.keys(iconCategories).map(category => (
                <TabsTrigger key={category} value={category} className="h-8 px-3">{category}</TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          
          <ScrollArea className="h-[320px]">
            <TabsContent value={activeTab || 'todos'} className="m-0 p-0">
              <div className="grid grid-cols-5 gap-1 p-2">
                {filteredIcons.map(iconName => {
                  const Icon = iconComponents[iconName];
                  const isSelected = value === iconName;
                  
                  return (
                    <Button
                      key={iconName}
                      variant="ghost"
                      className={`relative h-16 justify-start flex-col items-center ${
                        isSelected ? 'bg-accent' : ''
                      }`}
                      onClick={() => {
                        onChange(iconName);
                        setIsOpen(false);
                      }}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 absolute top-1 right-1 text-primary" />
                      )}
                      <Icon className="h-6 w-6 mb-1" />
                      <span className="text-[10px] mt-1 truncate w-full text-center">
                        {iconName}
                      </span>
                    </Button>
                  );
                })}
                {filteredIcons.length === 0 && (
                  <div className="col-span-5 h-24 flex items-center justify-center text-muted-foreground">
                    Nenhum ícone encontrado
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
