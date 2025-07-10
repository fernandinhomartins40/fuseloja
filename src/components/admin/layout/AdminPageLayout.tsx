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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href} className="text-gray-600 hover:text-gray-900">
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-gray-900 font-medium">
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
        )}

        {/* Title Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {badge && (
                <Badge variant={badge.variant || 'default'} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-gray-600 text-sm max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Action Button */}
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="flex items-center gap-2"
            >
              {action.icon || <Plus className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <Card className="border-0 shadow-sm bg-white">
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
};