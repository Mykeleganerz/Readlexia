import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Navigation } from '../components/Navigation';
import { ReadingRuler } from '../components/ReadingRuler';
import { SyllableSplitter } from '../components/SyllableSplitter';
import { ArrowLeft, Settings, ZoomIn, ZoomOut, Volume2, Square } from 'lucide-react';

export function Reader() {
  const { documentId } = useParams();
  const { user } = useAuth();
  const { getDocument } = useDocuments();
  const { settings, updateSettings } = useAccessibility();
  const navigate = useNavigate();
  const [document, setDocument] = useState(getDocument(Number(documentId)));
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    setDocument(getDocument(Number(documentId)));
  }, [documentId, getDocument]);

  useEffect(() => {
    return () => {
      // Cleanup TTS on unmount
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return alert('Text-to-speech not supported in this browser.');
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (document?.content) {
      utteranceRef.current = new SpeechSynthesisUtterance(document.content);
      utteranceRef.current.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  const { loading } = useDocuments();

  if (!user) {
    return null;
  }

  if (loading && !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Document not found</p>
          <button
            onClick={() => navigate('/documents')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const increaseFontSize = () => {
    updateSettings({ fontSize: Math.min(settings.fontSize + 2, 32) });
  };

  const decreaseFontSize = () => {
    updateSettings({ fontSize: Math.max(settings.fontSize - 2, 12) });
  };

  const getThemeClasses = () => {
    switch (settings.colorScheme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'highContrast':
        return 'bg-black text-yellow-300';
      case 'beige':
        return 'bg-[#f5f1e8] text-gray-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const fontFamilyStyle =
    settings.fontFamily === 'OpenDyslexic'
      ? { fontFamily: 'OpenDyslexic, sans-serif' }
      : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ReadingRuler />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Documents
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={decreaseFontSize}
              className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Decrease font size"
            >
              <ZoomOut size={20} />
            </button>

            <span className="text-gray-600 font-semibold">
              {settings.fontSize}px
            </span>

            <button
              onClick={increaseFontSize}
              className="p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Increase font size"
            >
              <ZoomIn size={20} />
            </button>

            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isPlaying 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              title={isPlaying ? 'Stop reading' : 'Read Aloud'}
            >
              {isPlaying ? <Square size={20} /> : <Volume2 size={20} />}
              <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Read Aloud'}</span>
            </button>

            <button
              onClick={() => setShowQuickSettings(!showQuickSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings size={20} />
              Quick Settings
            </button>
          </div>
        </div>

        {/* Quick Settings Panel */}
        {showQuickSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Quick Settings
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.readingRulerEnabled}
                    onChange={(e) =>
                      updateSettings({ readingRulerEnabled: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-700 font-semibold">
                    Reading Ruler
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.syllableSplitterEnabled}
                    onChange={(e) =>
                      updateSettings({
                        syllableSplitterEnabled: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-700 font-semibold">
                    Syllable Splitter
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Scheme
                </label>
                <select
                  value={settings.colorScheme}
                  onChange={(e) =>
                    updateSettings({ colorScheme: e.target.value as any })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="highContrast">High Contrast</option>
                  <option value="beige">Beige</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Line Spacing
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
                  className="w-full"
                />
                <div className="text-sm text-gray-600 text-center">
                  {settings.lineSpacing.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Title */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {document.title}
          </h1>
          <p className="text-gray-600">
            {document.category} • {document.uploadDate}
          </p>
        </div>

        {/* Reading Area */}
        <div
          className={`rounded-xl shadow-lg p-12 ${getThemeClasses()}`}
          style={{
            ...fontFamilyStyle,
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineSpacing,
            letterSpacing: `${settings.letterSpacing}em`,
          }}
        >
          <div className="prose max-w-none">
            <SyllableSplitter text={document.content} />
          </div>
        </div>

        {/* Reading Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Reading Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Move your mouse cursor to activate the reading ruler</li>
            <li>
              • Complex words are automatically split into syllables for easier
              reading
            </li>
            <li>• Adjust settings anytime using the Quick Settings panel</li>
            <li>• Take breaks every 20-30 minutes to reduce eye strain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
