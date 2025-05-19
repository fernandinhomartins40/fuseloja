
import React, { useEffect, useState } from 'react';
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Underline, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [currentTab, setCurrentTab] = useState<'visual' | 'html'>('visual');
  const [editorValue, setEditorValue] = useState(value);
  
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorValue(e.target.value);
    onChange(e.target.value);
  };

  // Para um editor visual completo, você precisaria integrar uma biblioteca como TinyMCE, CKEditor, etc.
  // Esta é uma versão simplificada que permite apenas edição HTML direta
  return (
    <div className="rich-text-editor">
      <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as 'visual' | 'html')}>
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="visual">
          <div className="border-b mb-2 pb-2 flex flex-wrap gap-1">
            <Toggle aria-label="Negrito">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Itálico">
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Sublinhado">
              <Underline className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Link">
              <Link className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Lista">
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Lista Numerada">
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Alinhar à Esquerda">
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Centralizar">
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Alinhar à Direita">
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Título 1">
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle aria-label="Título 2">
              <Heading2 className="h-4 w-4" />
            </Toggle>
          </div>
          
          <div 
            className="border p-2 rounded-md min-h-[300px] prose max-w-none" 
            contentEditable
            dangerouslySetInnerHTML={{ __html: editorValue }}
            onBlur={(e) => onChange(e.currentTarget.innerHTML)}
          />
          <div className="text-xs text-muted-foreground mt-2">
            * Use a aba HTML para edição avançada do conteúdo
          </div>
        </TabsContent>
        
        <TabsContent value="html">
          <Textarea 
            value={editorValue}
            onChange={handleHTMLChange}
            className="min-h-[300px] font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
