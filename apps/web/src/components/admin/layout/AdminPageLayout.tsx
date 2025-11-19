import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Plus } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children: React.ReactNode;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  badge,
  action,
  children
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="space-y-3 sm:space-y-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="overflow-x-auto">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href} className="text-gray-600 hover:text-gray-900 text-sm whitespace-nowrap">
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-gray-900 font-medium text-sm whitespace-nowrap">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
              {badge && (
                <Badge variant={badge.variant || 'default'} className="text-xs self-start sm:self-auto">
                  {badge.text}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-gray-600 text-sm sm:text-base max-w-full sm:max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Action Button */}
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start flex-shrink-0"
              size="sm"
            >
              {action.icon || <Plus className="h-4 w-4" />}
              <span className="truncate">{action.label}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {children}
      </div>
    </div>
  );
};