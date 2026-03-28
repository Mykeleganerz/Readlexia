import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Navigation } from '../components/Navigation';
import {
  Settings as SettingsIcon,
  Type,
  Palette,
  Ruler,
  RotateCcw,
} from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Accessibility Settings
            </h1>
            <p className="text-gray-600">Customize your reading experience</p>
          </div>
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RotateCcw size={20} />
            Reset to Default
          </button>
        </div>

        {/* Font Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Type className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Font Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Font Family
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateSettings({ fontFamily: 'OpenDyslexic' })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    settings.fontFamily === 'OpenDyslexic'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-800 mb-1">
                    OpenDyslexic
                  </div>
                  <div className="text-sm text-gray-600">
                    Specially designed for dyslexia
                  </div>
                </button>
                <button
                  onClick={() => updateSettings({ fontFamily: 'Arial' })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    settings.fontFamily === 'Arial'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-800 mb-1">Arial</div>
                  <div className="text-sm text-gray-600">
                    Standard sans-serif font
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Font Size: {settings.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="32"
                step="1"
                value={settings.fontSize}
                onChange={(e) =>
                  updateSettings({ fontSize: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Small (12px)</span>
                <span>Large (32px)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Line Spacing: {settings.lineSpacing.toFixed(1)}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={settings.lineSpacing}
                onChange={(e) =>
                  updateSettings({ lineSpacing: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Compact (1.0)</span>
                <span>Spacious (3.0)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Letter Spacing: {settings.letterSpacing.toFixed(2)}em
              </label>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.01"
                value={settings.letterSpacing}
                onChange={(e) =>
                  updateSettings({ letterSpacing: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Normal (0.00em)</span>
                <span>Wide (0.30em)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Scheme */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Color Scheme</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => updateSettings({ colorScheme: 'light' })}
              className={`p-6 border-2 rounded-lg transition-all ${
                settings.colorScheme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-white border border-gray-300 rounded-lg mb-3"></div>
              <div className="font-bold text-gray-800">Light Theme</div>
              <div className="text-sm text-gray-600">
                Standard white background
              </div>
            </button>

            <button
              onClick={() => updateSettings({ colorScheme: 'dark' })}
              className={`p-6 border-2 rounded-lg transition-all ${
                settings.colorScheme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-gray-900 rounded-lg mb-3"></div>
              <div className="font-bold text-gray-800">Dark Theme</div>
              <div className="text-sm text-gray-600">
                Reduces eye strain in low light
              </div>
            </button>

            <button
              onClick={() => updateSettings({ colorScheme: 'highContrast' })}
              className={`p-6 border-2 rounded-lg transition-all ${
                settings.colorScheme === 'highContrast'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-black rounded-lg mb-3 flex items-center justify-center">
                <span className="text-yellow-300 font-bold">ABC</span>
              </div>
              <div className="font-bold text-gray-800">High Contrast</div>
              <div className="text-sm text-gray-600">Maximum readability</div>
            </button>

            <button
              onClick={() => updateSettings({ colorScheme: 'beige' })}
              className={`p-6 border-2 rounded-lg transition-all ${
                settings.colorScheme === 'beige'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-20 bg-[#f5f1e8] rounded-lg mb-3"></div>
              <div className="font-bold text-gray-800">Beige Theme</div>
              <div className="text-sm text-gray-600">
                Warm, comfortable reading
              </div>
            </button>
          </div>
        </div>

        {/* Reading Tools */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Ruler className="text-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reading Tools</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div>
                <div className="font-bold text-gray-800 mb-1">
                  Reading Ruler
                </div>
                <div className="text-sm text-gray-600">
                  Highlights the line under your cursor
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.readingRulerEnabled}
                  onChange={(e) =>
                    updateSettings({ readingRulerEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.readingRulerEnabled && (
              <div className="ml-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ruler Height: {settings.rulerHeight}px
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="120"
                    step="10"
                    value={settings.rulerHeight}
                    onChange={(e) =>
                      updateSettings({ rulerHeight: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div>
                <div className="font-bold text-gray-800 mb-1">
                  Syllable Splitter
                </div>
                <div className="text-sm text-gray-600">
                  Breaks complex words into syllables
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.syllableSplitterEnabled}
                  onChange={(e) =>
                    updateSettings({
                      syllableSplitterEnabled: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            💡 Settings Saved Automatically
          </h3>
          <p className="text-blue-800">
            All your preferences are saved automatically and will be applied to
            all your reading sessions. Visit the Reader to see your settings in
            action!
          </p>
        </div>
      </div>
    </div>
  );
}
