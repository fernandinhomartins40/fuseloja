
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
    <div className="mb-8 relative">
      {breadcrumbs && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-slate-400">/</span>}
                {breadcrumb.href ? (
                  <a href={breadcrumb.href} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-slate-800 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between relative">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-slate-600 font-medium">{description}</p>
          )}
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 border-0"
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </Button>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-5 -right-5 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-2xl" />
    </div>
  );
};
