import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilitySettings {
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  letterSpacing: number;
  colorScheme: 'light' | 'dark' | 'highContrast' | 'beige';
  syllableSplitterEnabled: boolean;
  readingRulerEnabled: boolean;
  rulerHeight: number;
  rulerColor: string;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  fontFamily: 'OpenDyslexic',
  lineSpacing: 1.8,
  letterSpacing: 0.12,
  colorScheme: 'light',
  syllableSplitterEnabled: true,
  readingRulerEnabled: true,
  rulerHeight: 60,
  rulerColor: 'rgba(100, 150, 255, 0.2)',
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply settings to document root
    document.documentElement.style.setProperty('--reading-font-size', `${settings.fontSize}px`);
    document.documentElement.style.setProperty('--reading-line-spacing', settings.lineSpacing.toString());
    document.documentElement.style.setProperty('--reading-letter-spacing', `${settings.letterSpacing}em`);
    document.documentElement.setAttribute('data-theme', settings.colorScheme);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
