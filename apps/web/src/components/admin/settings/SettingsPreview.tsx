
import React from 'react';
import { VisualSettings } from '@fuseloja/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SettingsPreviewProps {
  visualSettings: VisualSettings;
  storeName: string;
}

export const SettingsPreview: React.FC<SettingsPreviewProps> = ({ 
  visualSettings, 
  storeName 
}) => {
  const previewStyle = {
    '--preview-primary': visualSettings.colors.primary,
    '--preview-secondary': visualSettings.colors.secondary,
    '--preview-background': visualSettings.colors.background,
    '--preview-text': visualSettings.colors.text,
    '--button-hover-primary': visualSettings.buttonHover.primaryColor,
    '--button-hover-secondary': visualSettings.buttonHover.secondaryColor,
    '--button-hover-duration': `${visualSettings.buttonHover.duration}ms`,
    '--button-hover-intensity': `${visualSettings.buttonHover.intensity}`,
    fontFamily: visualSettings.fontFamily,
  } as React.CSSProperties;

  const getButtonClasses = () => {
    const baseClasses = "px-4 py-2 text-white transition-all";
    const styleClasses = {
      rounded: "rounded-md",
      square: "rounded-none", 
      bordered: "rounded-md border-2 border-white"
    };
    
    let hoverClasses = "";
    if (visualSettings.buttonHover.enabled) {
      switch (visualSettings.buttonHover.animationType) {
        case 'scale':
          hoverClasses = "hover:scale-105";
          break;
        case 'fade':
          hoverClasses = "hover:opacity-90";
          break;
        case 'slide':
          hoverClasses = "hover:-translate-y-0.5";
          break;
        case 'bounce':
          hoverClasses = "hover:animate-bounce";
          break;
      }
    }
    
    return `${baseClasses} ${styleClasses[visualSettings.buttonStyle]} ${hoverClasses}`;
  };

  const getButtonStyle = (isPrimary: boolean = true) => {
    const baseColor = isPrimary ? visualSettings.colors.primary : visualSettings.colors.secondary;
    const hoverColor = isPrimary ? visualSettings.buttonHover.primaryColor : visualSettings.buttonHover.secondaryColor;
    
    return {
      backgroundColor: baseColor,
      transition: `all ${visualSettings.buttonHover.duration}ms ease`,
      ...(visualSettings.buttonHover.enabled && {
        '--tw-scale-x': '1',
        '--tw-scale-y': '1',
      })
    };
  };

  return (
    <Card className="shadow-sm">
      <div className="p-4">
        <h4 className="text-sm font-medium mb-3">Preview das Configurações</h4>
        
        <div 
          className="p-4 border rounded-lg min-h-[200px]"
          style={{
            ...previewStyle,
            backgroundColor: visualSettings.colors.background,
            color: visualSettings.colors.text
          }}
        >
          {/* Logo Preview */}
          <div className="mb-4">
            {visualSettings.logo && (
              <img 
                src={visualSettings.logo} 
                alt={storeName}
                className="h-8 object-contain"
              />
            )}
          </div>
          
          {/* Header Preview */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2" style={{ color: visualSettings.colors.text }}>
              {storeName}
            </h1>
            <nav className="flex gap-4">
              <a href="#" className="hover:opacity-80" style={{ color: visualSettings.colors.text }}>
                Início
              </a>
              <a href="#" className="hover:opacity-80" style={{ color: visualSettings.colors.text }}>
                Produtos
              </a>
              <a href="#" className="hover:opacity-80" style={{ color: visualSettings.colors.text }}>
                Contato
              </a>
            </nav>
          </div>
          
          {/* Content Preview */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2" style={{ color: visualSettings.colors.primary }}>
              Exemplo de Conteúdo
            </h2>
            <p className="mb-4" style={{ color: visualSettings.colors.text }}>
              Este é um exemplo de como seu texto aparecerá com as configurações selecionadas.
            </p>
          </div>
          
          {/* Interactive Buttons Preview */}
          <div className="flex gap-2 mb-4">
            <button 
              className={getButtonClasses()}
              style={getButtonStyle(true)}
              onMouseEnter={(e) => {
                if (visualSettings.buttonHover.enabled) {
                  e.currentTarget.style.backgroundColor = visualSettings.buttonHover.primaryColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = visualSettings.colors.primary;
              }}
            >
              Botão Primário
            </button>
            <button 
              className={getButtonClasses()}
              style={getButtonStyle(false)}
              onMouseEnter={(e) => {
                if (visualSettings.buttonHover.enabled) {
                  e.currentTarget.style.backgroundColor = visualSettings.buttonHover.secondaryColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = visualSettings.colors.secondary;
              }}
            >
              Botão Secundário
            </button>
          </div>
          
          {/* Animation Info */}
          {visualSettings.buttonHover.enabled && (
            <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
              <strong>Configurações de Hover:</strong><br />
              Animação: {visualSettings.buttonHover.animationType}<br />
              Duração: {visualSettings.buttonHover.duration}ms<br />
              Intensidade: {visualSettings.buttonHover.intensity}%
            </div>
          )}
          
          {/* Card Preview */}
          <div 
            className="p-3 border rounded-lg"
            style={{ 
              borderColor: visualSettings.colors.primary + '30',
              backgroundColor: visualSettings.colors.background 
            }}
          >
            <h3 className="font-medium mb-1" style={{ color: visualSettings.colors.primary }}>
              Card de Exemplo
            </h3>
            <p className="text-sm" style={{ color: visualSettings.colors.text }}>
              Exemplo de conteúdo em um card com as cores configuradas.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
