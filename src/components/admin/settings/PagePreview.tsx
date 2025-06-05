
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PagePreviewProps {
  content: string;
  title: string;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ content, title }) => {
  const handleOpenPreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      const previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${title}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: Inter, sans-serif; }
            .prose { max-width: none; }
            .prose h1 { font-size: 2.25rem; font-weight: bold; margin-bottom: 1rem; }
            .prose h2 { font-size: 1.875rem; font-weight: bold; margin-bottom: 0.75rem; margin-top: 2rem; }
            .prose h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.5rem; }
            .prose p { margin-bottom: 1rem; line-height: 1.7; }
            .prose ul { margin-bottom: 1rem; padding-left: 1.5rem; }
            .prose li { margin-bottom: 0.25rem; }
            .prose a { color: #3b82f6; text-decoration: underline; }
            .prose a:hover { color: #1d4ed8; }
            .prose img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
            .prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            .prose th, .prose td { border: 1px solid #d1d5db; padding: 0.75rem; text-align: left; }
            .prose th { background-color: #f9fafb; font-weight: 600; }
            .prose blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; margin: 1rem 0; font-style: italic; }
            .prose pre { background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
            .prose code { background-color: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; }
          </style>
        </head>
        <body class="bg-gray-50 py-8">
          <div class="container mx-auto px-4 max-w-4xl">
            <div class="bg-white p-8 rounded-lg shadow-sm">
              <div class="prose prose-lg">${content}</div>
            </div>
          </div>
        </body>
        </html>
      `;
      previewWindow.document.write(previewContent);
      previewWindow.document.close();
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview Inline
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview: {title}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            <Card className="p-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" size="sm" onClick={handleOpenPreview}>
        <ExternalLink className="h-4 w-4 mr-2" />
        Preview Nova Aba
      </Button>
    </div>
  );
};
