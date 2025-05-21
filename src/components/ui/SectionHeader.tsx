import React from 'react';
import { cn } from '@/lib/utils';
interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actionLabel?: string;
  onAction?: () => void;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  className,
  actionLabel,
  onAction
}) => {
  return <div className={cn("flex flex-col items-center mb-6 md:mb-8 px-2", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-center">{title}</h2>
      {description && <p className="mt-2 text-sm md:text-base text-muted-foreground text-center max-w-2xl">{description}</p>}
      {actionLabel && onAction}
    </div>;
};