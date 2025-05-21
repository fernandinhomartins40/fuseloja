
import React, { useEffect, useState, useRef } from 'react';
import { 
  Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Underline, Link, Image, Code, Table, 
  Palette, Quote, Undo, Redo, Heading3, AlignJustify, 
  Minus, FileVideo, ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [currentTab, setCurrentTab] = useState<'visual' | 'html'>('visual');
  const [editorValue, setEditorValue] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [showLinkPopover, setShowLinkPopover] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showImagePopover, setShowImagePopover] = useState<boolean>(false);
  
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorValue(e.target.value);
    onChange(e.target.value);
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setEditorValue(html);
      onChange(html);
    }
  };

  const handleInsertLink = () => {
    executeCommand('createLink', linkUrl);
    setShowLinkPopover(false);
    setLinkUrl('');
  };

  const handleInsertImage = () => {
    executeCommand('insertHTML', `<img src="${imageUrl}" alt="Imagem inserida" style="max-width: 100%; height: auto;" />`);
    setShowImagePopover(false);
    setImageUrl('');
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cabeçalho 1</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cabeçalho 2</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cabeçalho 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Item 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Item 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Item 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Item 4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Item 5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Item 6</td>
          </tr>
        </tbody>
      </table>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleInsertVideo = () => {
    const videoHtml = `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
        <iframe
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;
    executeCommand('insertHTML', videoHtml);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Prevent the default paste
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert as plain text
    executeCommand('insertText', text);
  };

  const ToolbarButton = ({ icon, command, value, tooltip }: { icon: React.ReactNode, command: string, value?: string, tooltip: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle 
            aria-label={tooltip} 
            onClick={() => executeCommand(command, value)}
          >
            {icon}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

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
          <div className="border-b mb-2 pb-2">
            {/* Estilo de texto */}
            <div className="flex flex-wrap gap-1 mb-2">
              <ToolbarButton icon={<Bold className="h-4 w-4" />} command="bold" tooltip="Negrito" />
              <ToolbarButton icon={<Italic className="h-4 w-4" />} command="italic" tooltip="Itálico" />
              <ToolbarButton icon={<Underline className="h-4 w-4" />} command="underline" tooltip="Sublinhado" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <ToolbarButton icon={<Heading1 className="h-4 w-4" />} command="formatBlock" value="<h1>" tooltip="Título 1" />
              <ToolbarButton icon={<Heading2 className="h-4 w-4" />} command="formatBlock" value="<h2>" tooltip="Título 2" />
              <ToolbarButton icon={<Heading3 className="h-4 w-4" />} command="formatBlock" value="<h3>" tooltip="Título 3" />
              <ToolbarButton icon={<Minus className="h-4 w-4" />} command="insertHorizontalRule" tooltip="Linha horizontal" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Cor de texto */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Toggle aria-label="Cor do texto">
                          <Palette className="h-4 w-4" />
                        </Toggle>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-8 gap-1">
                          {['#000000', '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', 
                            '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080', '#888888', 
                            '#ffffff'].map(color => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded-md border border-gray-300"
                              style={{ backgroundColor: color }}
                              onClick={() => executeCommand('foreColor', color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cor do texto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Alinhamento e listas */}
            <div className="flex flex-wrap gap-1 mb-2">
              <ToolbarButton icon={<AlignLeft className="h-4 w-4" />} command="justifyLeft" tooltip="Alinhar à esquerda" />
              <ToolbarButton icon={<AlignCenter className="h-4 w-4" />} command="justifyCenter" tooltip="Centralizar" />
              <ToolbarButton icon={<AlignRight className="h-4 w-4" />} command="justifyRight" tooltip="Alinhar à direita" />
              <ToolbarButton icon={<AlignJustify className="h-4 w-4" />} command="justifyFull" tooltip="Justificar" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <ToolbarButton icon={<List className="h-4 w-4" />} command="insertUnorderedList" tooltip="Lista não ordenada" />
              <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} command="insertOrderedList" tooltip="Lista ordenada" />
              <ToolbarButton icon={<ListChecks className="h-4 w-4" />} command="insertHTML" value="<ul style='list-style-type: none; padding-left: 20px;'><li style='position: relative;'><input type='checkbox' style='position: absolute; left: -20px;'> Item da lista</li></ul>" tooltip="Lista de verificação" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <ToolbarButton icon={<Quote className="h-4 w-4" />} command="formatBlock" value="<blockquote>" tooltip="Citação" />
              <ToolbarButton icon={<Code className="h-4 w-4" />} command="formatBlock" value="<pre>" tooltip="Bloco de código" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <ToolbarButton icon={<Undo className="h-4 w-4" />} command="undo" tooltip="Desfazer" />
              <ToolbarButton icon={<Redo className="h-4 w-4" />} command="redo" tooltip="Refazer" />
            </div>

            {/* Links, imagens e inserções */}
            <div className="flex flex-wrap gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
                      <PopoverTrigger asChild>
                        <Toggle aria-label="Inserir link">
                          <Link className="h-4 w-4" />
                        </Toggle>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Inserir link</h4>
                            <p className="text-sm text-muted-foreground">
                              Digite a URL do link que deseja inserir
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <Input 
                              placeholder="https://example.com" 
                              value={linkUrl}
                              onChange={e => setLinkUrl(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleInsertLink}>Inserir Link</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inserir link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover open={showImagePopover} onOpenChange={setShowImagePopover}>
                      <PopoverTrigger asChild>
                        <Toggle aria-label="Inserir imagem">
                          <Image className="h-4 w-4" />
                        </Toggle>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Inserir imagem</h4>
                            <p className="text-sm text-muted-foreground">
                              Digite a URL da imagem que deseja inserir
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <Input 
                              placeholder="https://example.com/imagem.jpg" 
                              value={imageUrl}
                              onChange={e => setImageUrl(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleInsertImage}>Inserir Imagem</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inserir imagem</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle aria-label="Inserir tabela" onClick={handleInsertTable}>
                      <Table className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inserir tabela</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle aria-label="Inserir vídeo" onClick={handleInsertVideo}>
                      <FileVideo className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inserir vídeo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div 
            ref={editorRef}
            className="border p-2 rounded-md min-h-[300px] prose max-w-none overflow-auto" 
            contentEditable
            dangerouslySetInnerHTML={{ __html: editorValue }}
            onBlur={(e) => onChange(e.currentTarget.innerHTML)}
            onPaste={handlePaste}
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
