
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
                {index > 0 && <span className="mx-2 text-slate-400">/</span>}
                {breadcrumb.href ? (
                  <a href={breadcrumb.href} className="text-slate-600 hover:text-indigo-600 transition-colors font-semibold rounded-lg px-2 py-1 hover:bg-indigo-50">
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 font-bold bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 rounded-lg">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-slate-600 font-medium">{description}</p>
          )}
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {action.icon && <action.icon className="w-5 h-5" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};
