
import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export const useStyleSettings = () => {
  const { settings } = useSettings();

  useEffect(() => {
    const applyButtonStyles = () => {
      const buttons = document.querySelectorAll('button, .btn');
      
      buttons.forEach((button) => {
        const element = button as HTMLElement;
        
        // Remove existing style classes
        element.classList.remove('rounded-md', 'rounded-none', 'border-2');
        
        // Apply new styles based on settings
        switch (settings.visual.buttonStyle) {
          case 'rounded':
            element.classList.add('rounded-md');
            break;
          case 'square':
            element.classList.add('rounded-none');
            break;
          case 'bordered':
            element.classList.add('rounded-md', 'border-2');
            break;
        }
      });
    };

    // Apply styles with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(applyButtonStyles, 100);
    
    return () => clearTimeout(timeoutId);
  }, [settings.visual.buttonStyle]);

  return {
    primaryColor: settings.visual.colors.primary,
    secondaryColor: settings.visual.colors.secondary,
    backgroundColor: settings.visual.colors.background,
    textColor: settings.visual.colors.text,
    fontFamily: settings.visual.fontFamily,
    buttonStyle: settings.visual.buttonStyle
  };
};
