
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreSettings } from '@/types/settings';
import { defaultSettings } from '@/utils/defaultSettings';

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
  updateGeneralSettings: (generalSettings: StoreSettings['general']) => void;
  updateVisualSettings: (visualSettings: StoreSettings['visual']) => void;
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
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply visual settings to document
  useEffect(() => {
    const applyVisualSettings = () => {
      const root = document.documentElement;
      
      // Apply CSS custom properties
      root.style.setProperty('--color-primary', settings.visual.colors.primary);
      root.style.setProperty('--color-secondary', settings.visual.colors.secondary);
      root.style.setProperty('--color-background', settings.visual.colors.background);
      root.style.setProperty('--color-text', settings.visual.colors.text);
      root.style.setProperty('--font-family', settings.visual.fontFamily);
      
      // Update favicon if set
      if (settings.visual.favicon) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = settings.visual.favicon;
        }
      }
      
      // Update page title
      document.title = settings.general.storeName;
    };

    applyVisualSettings();
  }, [settings.visual, settings.general.storeName]);

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateGeneralSettings = (generalSettings: StoreSettings['general']) => {
    const newSettings = { ...settings, general: generalSettings };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const updateVisualSettings = (visualSettings: StoreSettings['visual']) => {
    const newSettings = { ...settings, visual: visualSettings };
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
    updateVisualSettings,
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
