
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, categoryColorsMap } from '@/types/category';
import { iconComponents, IconName } from '@/utils/categoryIcons';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onEdit, 
  onDelete 
}) => {
  const IconComponent = category.icon ? iconComponents[category.icon as IconName] : null;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          className={cn(
            "p-6 flex flex-col items-center justify-center text-center"
          )}
          style={{
            backgroundColor: categoryColorsMap[category.color]?.bg
          }}
        >
          {IconComponent && (
            <div className="rounded-full p-4 bg-white/80 mb-3">
              <IconComponent 
                className="h-8 w-8"
                style={{
                  color: categoryColorsMap[category.color]?.text
                }}
              />
            </div>
          )}
          <h3 className="font-bold">{category.name}</h3>
          {category.description && (
            <p className="text-sm mt-1 line-clamp-2">{category.description}</p>
          )}
          {category.isDefault && (
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                Padrão do sistema
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-3 bg-muted/20">
        <div className="text-xs text-muted-foreground">
          #{category.slug}
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => onEdit(category)}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete(category.id)}
            disabled={category.isDefault}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
