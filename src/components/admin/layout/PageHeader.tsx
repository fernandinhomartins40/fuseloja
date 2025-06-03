
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  breadcrumbs
}) => {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {breadcrumb.href ? (
                  <a href={breadcrumb.href} className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-semibold">
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-600">{description}</p>
          )}
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};
