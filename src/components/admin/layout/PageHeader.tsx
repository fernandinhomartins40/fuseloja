
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
    <div className="mb-10">
      {breadcrumbs && (
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-3 text-slate-400 text-lg">•</span>}
                {breadcrumb.href ? (
                  <a href={breadcrumb.href} className="text-slate-600 hover:text-indigo-600 transition-all duration-300 font-bold rounded-xl px-4 py-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105">
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 font-black bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-5 py-2 rounded-xl shadow-md">
                    {breadcrumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-20"></div>
          <div className="relative">
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-slate-600 font-bold bg-white bg-opacity-70 px-4 py-2 rounded-xl inline-block">{description}</p>
            )}
          </div>
        </div>
        
        {action && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30"></div>
            <Button
              onClick={action.onClick}
              className="relative flex items-center gap-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-black px-8 py-4 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 border-0 text-lg"
            >
              {action.icon && <action.icon className="w-6 h-6" />}
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
