import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreSettings } from '@/types/settings';
import { defaultSettings } from '@/utils/defaultSettings';

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  updateGeneralSettings: (generalSettings: StoreSettings['general']) => void;
  updateMarqueeSettings: (marqueeSettings: StoreSettings['marquee']) => void;
  updateVisualSettings: (visualSettings: StoreSettings['visual']) => void;
  updateSliderSettings: (sliderSettings: StoreSettings['slider']) => void;
  updateBannerSettings: (bannerSettings: StoreSettings['banners']) => void;
  updatePageContent: (pageContent: StoreSettings['pageContent']) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (settingsJson: string) => Promise<boolean>;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge with default settings to ensure all new properties exist
        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
          // Ensure new sections exist with defaults if not present
          marquee: { ...defaultSettings.marquee, ...parsedSettings.marquee },
          navbar: { ...defaultSettings.navbar, ...parsedSettings.navbar },
          slider: { ...defaultSettings.slider, ...parsedSettings.slider },
          featureCards: { ...defaultSettings.featureCards, ...parsedSettings.featureCards },
          footer: { ...defaultSettings.footer, ...parsedSettings.footer }
        };
        setSettings(mergedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply visual settings to document
  useEffect(() => {
    const applyVisualSettings = () => {
      const root = document.documentElement;
      
      // Apply configurable CSS custom properties
      root.style.setProperty('--color-primary', settings.visual.colors.primary);
      root.style.setProperty('--color-secondary', settings.visual.colors.secondary);
      root.style.setProperty('--color-background', settings.visual.colors.background);
      root.style.setProperty('--color-text', settings.visual.colors.text);
      root.style.setProperty('--font-family', settings.visual.fontFamily);
      
      // Apply navbar colors
      root.style.setProperty('--navbar-bg', settings.navbar.backgroundColor);
      root.style.setProperty('--navbar-text', settings.navbar.textColor);
      
      // Apply footer colors
      root.style.setProperty('--footer-bg', settings.footer.backgroundColor);
      root.style.setProperty('--footer-text', settings.footer.textColor);
      
      // Convert hex to HSL for better Tailwind integration
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      // Update primary color in HSL format
      try {
        const primaryHsl = hexToHsl(settings.visual.colors.primary);
        root.style.setProperty('--primary', primaryHsl);
      } catch (error) {
        console.warn('Error converting primary color to HSL:', error);
      }
      
      // Update favicon if set
      if (settings.visual.favicon) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = settings.visual.favicon;
        } else {
          const newFavicon = document.createElement('link');
          newFavicon.rel = 'icon';
          newFavicon.href = settings.visual.favicon;
          document.head.appendChild(newFavicon);
        }
      }
      
      // Update page title
      document.title = settings.general.storeName;
    };

    applyVisualSettings();
  }, [settings.visual, settings.general.storeName, settings.navbar, settings.footer]);

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateGeneralSettings = (generalSettings: StoreSettings['general']) => {
    const newSettings = { ...settings, general: generalSettings };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateMarqueeSettings = (marqueeSettings: StoreSettings['marquee']) => {
    const newSettings = { ...settings, marquee: marqueeSettings };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateVisualSettings = (visualSettings: StoreSettings['visual']) => {
    const newSettings = { ...settings, visual: visualSettings };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateSliderSettings = (sliderSettings: StoreSettings['slider']) => {
    const newSettings = { ...settings, slider: sliderSettings };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateBannerSettings = (bannerSettings: StoreSettings['banners']) => {
    const newSettings = { ...settings, banners: bannerSettings };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updatePageContent = (pageContent: StoreSettings['pageContent']) => {
    const newSettings = { ...settings, pageContent: pageContent };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('storeSettings', JSON.stringify(settings));
      setHasUnsavedChanges(false);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
  };

  const exportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${settings.general.storeName.toLowerCase().replace(/\s+/g, '-')}-settings.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importSettings = async (settingsJson: string): Promise<boolean> => {
    try {
      const importedSettings = JSON.parse(settingsJson);
      
      // Validate imported settings structure
      if (!importedSettings.general || !importedSettings.visual) {
        throw new Error('Invalid settings format');
      }
      
      const validatedSettings = { ...defaultSettings, ...importedSettings };
      setSettings(validatedSettings);
      setHasUnsavedChanges(true);
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateGeneralSettings,
    updateMarqueeSettings,
    updateVisualSettings,
    updateSliderSettings,
    updateBannerSettings,
    updatePageContent,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
    isLoading,
    hasUnsavedChanges
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
