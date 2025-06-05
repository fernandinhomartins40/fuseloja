
import React, { useEffect, useState, useRef } from 'react';
import { 
  Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Underline, Link, Image, Code, Table, 
  Palette, Quote, Undo, Redo, Heading3, AlignJustify, 
  Minus, FileVideo, ListChecks, Save, RotateCcw
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
import { EditorImageUploader } from './EditorImageUploader';
import { PagePreview } from './PagePreview';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  title?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, title = "Página" }) => {
  const [currentTab, setCurrentTab] = useState<'visual' | 'html'>('visual');
  const [editorValue, setEditorValue] = useState(value);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [showLinkPopover, setShowLinkPopover] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>('14');
  
  useEffect(() => {
    setEditorValue(value);
    setHasUnsavedChanges(false);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setEditorValue(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onChange(editorValue);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setEditorValue(value);
    setHasUnsavedChanges(false);
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  };

  const handleHTMLChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleContentChange(e.target.value);
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      handleContentChange(html);
    }
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      executeCommand('createLink', linkUrl);
      setShowLinkPopover(false);
      setLinkUrl('');
    }
  };

  const handleImageInsert = (imageUrl: string, altText?: string) => {
    const imgHtml = `<img src="${imageUrl}" alt="${altText || 'Imagem inserida'}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    executeCommand('insertHTML', imgHtml);
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f9fafb;">Cabeçalho 1</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f9fafb;">Cabeçalho 2</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #f9fafb;">Cabeçalho 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">Item 1</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Item 2</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Item 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">Item 4</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Item 5</td>
            <td style="border: 1px solid #ddd; padding: 12px;">Item 6</td>
          </tr>
        </tbody>
      </table>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleInsertVideo = () => {
    const videoId = prompt('Digite o ID do vídeo do YouTube (exemplo: dQw4w9WgXcQ):');
    if (videoId) {
      const videoHtml = `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 15px 0;">
          <iframe
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
      executeCommand('insertHTML', videoHtml);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    executeCommand('fontSize', size);
  };

  const insertTemplate = (templateType: string) => {
    let templateHtml = '';
    
    switch (templateType) {
      case 'contact-form':
        templateHtml = `
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3>Formulário de Contato</h3>
            <form style="display: grid; gap: 15px; max-width: 500px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Nome</label>
                <input type="text" placeholder="Seu nome" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" />
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">E-mail</label>
                <input type="email" placeholder="Seu e-mail" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" />
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Mensagem</label>
                <textarea placeholder="Sua mensagem" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
              </div>
              <button type="submit" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Enviar</button>
            </form>
          </div>
        `;
        break;
      case 'feature-grid':
        templateHtml = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">
            <div style="text-align: center; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="width: 60px; height: 60px; background: #3b82f6; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">✓</div>
              <h4>Recurso 1</h4>
              <p>Descrição do primeiro recurso da sua empresa.</p>
            </div>
            <div style="text-align: center; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="width: 60px; height: 60px; background: #10b981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">★</div>
              <h4>Recurso 2</h4>
              <p>Descrição do segundo recurso da sua empresa.</p>
            </div>
            <div style="text-align: center; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="width: 60px; height: 60px; background: #f59e0b; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">♦</div>
              <h4>Recurso 3</h4>
              <p>Descrição do terceiro recurso da sua empresa.</p>
            </div>
          </div>
        `;
        break;
      case 'cta-section':
        templateHtml = `
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 40px; text-align: center; border-radius: 12px; margin: 30px 0; color: white;">
            <h2 style="color: white; margin-bottom: 15px;">Pronto para começar?</h2>
            <p style="font-size: 18px; margin-bottom: 25px; opacity: 0.9;">Junte-se a milhares de clientes satisfeitos</p>
            <button style="background: white; color: #3b82f6; padding: 15px 30px; border: none; border-radius: 6px; font-weight: 600; font-size: 16px; cursor: pointer;">Entre em Contato</button>
          </div>
        `;
        break;
    }
    
    if (templateHtml) {
      executeCommand('insertHTML', templateHtml);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
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
          
          <div className="flex items-center gap-2">
            <PagePreview content={editorValue} title={title} />
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-600">Alterações não salvas</span>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Desfazer
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-3 w-3 mr-1" />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <TabsContent value="visual">
          <div className="border-b mb-2 pb-2">
            {/* Primeira linha - Texto e formatação */}
            <div className="flex flex-wrap gap-1 mb-2">
              <ToolbarButton icon={<Bold className="h-4 w-4" />} command="bold" tooltip="Negrito" />
              <ToolbarButton icon={<Italic className="h-4 w-4" />} command="italic" tooltip="Itálico" />
              <ToolbarButton icon={<Underline className="h-4 w-4" />} command="underline" tooltip="Sublinhado" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Tamanho da fonte */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <select 
                      value={fontSize} 
                      onChange={(e) => handleFontSizeChange(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="1">Pequeno</option>
                      <option value="3">Normal</option>
                      <option value="4">Grande</option>
                      <option value="5">Muito Grande</option>
                    </select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tamanho da fonte</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Separator orientation="vertical" className="mx-1 h-6" />
              <ToolbarButton icon={<Heading1 className="h-4 w-4" />} command="formatBlock" value="<h1>" tooltip="Título 1" />
              <ToolbarButton icon={<Heading2 className="h-4 w-4" />} command="formatBlock" value="<h2>" tooltip="Título 2" />
              <ToolbarButton icon={<Heading3 className="h-4 w-4" />} command="formatBlock" value="<h3>" tooltip="Título 3" />
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
                            '#ffffff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
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
            
            {/* Segunda linha - Alinhamento e listas */}
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
              <ToolbarButton icon={<Minus className="h-4 w-4" />} command="insertHorizontalRule" tooltip="Linha horizontal" />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <ToolbarButton icon={<Undo className="h-4 w-4" />} command="undo" tooltip="Desfazer" />
              <ToolbarButton icon={<Redo className="h-4 w-4" />} command="redo" tooltip="Refazer" />
            </div>

            {/* Terceira linha - Mídia e inserções */}
            <div className="flex flex-wrap gap-1 mb-2">
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
              
              <EditorImageUploader onImageInsert={handleImageInsert} />
              
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
                    <p>Inserir vídeo do YouTube</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Separator orientation="vertical" className="mx-1 h-6" />
              
              {/* Templates */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          Templates
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-2">
                          <h4 className="font-medium">Inserir Template</h4>
                          <div className="grid gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => insertTemplate('contact-form')}
                            >
                              Formulário de Contato
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => insertTemplate('feature-grid')}
                            >
                              Grade de Recursos
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => insertTemplate('cta-section')}
                            >
                              Seção de Chamada
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inserir templates</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div 
            ref={editorRef}
            className="border p-4 rounded-md min-h-[400px] prose max-w-none overflow-auto focus:outline-none" 
            contentEditable
            dangerouslySetInnerHTML={{ __html: editorValue }}
            onBlur={(e) => handleContentChange(e.currentTarget.innerHTML)}
            onPaste={handlePaste}
            style={{ lineHeight: '1.6' }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            * Use a aba HTML para edição avançada do conteúdo. Use Ctrl/Cmd+Z para desfazer.
          </div>
        </TabsContent>
        
        <TabsContent value="html">
          <Textarea 
            value={editorValue}
            onChange={handleHTMLChange}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Digite o HTML da página aqui..."
          />
          <div className="text-xs text-muted-foreground mt-2">
            * Modo HTML avançado. Tenha cuidado com a sintaxe.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
