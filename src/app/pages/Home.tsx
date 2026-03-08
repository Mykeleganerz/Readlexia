import { Link } from 'react-router';
import {
  Book,
  Eye,
  Settings,
  FileText,
  Sparkles,
  Lightbulb,
  Target,
} from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">ReaDlexia</h1>
          <p className="text-2xl text-gray-700">
            Empowering readers with dyslexia through accessible reading tools
          </p>
        </header>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Read with Confidence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our platform provides specialized tools designed for dyslexic
            readers, including cursor-following reading rulers, automatic
            syllable splitting, and customizable accessibility settings.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Eye className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Reading Ruler
            </h3>
            <p className="text-gray-600">
              Cursor-following ruler helps you focus on the current line
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Book className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Syllable Splitter
            </h3>
            <p className="text-gray-600">
              Automatic syllable separation for complex words
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Settings className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Custom Settings
            </h3>
            <p className="text-gray-600">
              Adjust fonts, colors, spacing to match your preferences
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <FileText className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Document Manager
            </h3>
            <p className="text-gray-600">
              Upload and organize your reading materials
            </p>
          </div>
        </div>

        {/* Exercise Generator Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-12 mb-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-3xl font-bold">Exercise Generator</h2>
              </div>
              <p className="text-lg text-indigo-50 mb-6">
                Transform any document into interactive learning exercises. Our
                Exercise generator creates comprehension questions,
                fill-in-the-blank activities, and vocabulary exercises tailored
                to your reading level.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Lightbulb size={20} className="text-yellow-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Smart Content Analysis</p>
                    <p className="text-sm text-indigo-100">
                      Automatically extract key concepts and generate relevant
                      exercises
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Target size={20} className="text-green-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Customizable Difficulty</p>
                    <p className="text-sm text-indigo-100">
                      Adjust exercise complexity to match your learning pace
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-300 mb-2">
                    📝 Upload Document
                  </p>
                  <p className="text-sm text-indigo-50">
                    Upload any PDF, text file, or paste content directly
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-300 mb-2">
                    ⚡ Generate Exercises
                  </p>
                  <p className="text-sm text-indigo-50">
                    Analyzes content and creates personalized exercises
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-300 mb-2">
                    📊 Practice & Track
                  </p>
                  <p className="text-sm text-indigo-50">
                    Complete exercises and monitor your progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Features Designed for You
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ✓ OpenDyslexic Font
              </h3>
              <p className="text-gray-600 mb-4">
                Specially designed font that helps prevent letter confusion
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ✓ High Contrast Themes
              </h3>
              <p className="text-gray-600 mb-4">
                Multiple color schemes to reduce eye strain
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ✓ Adjustable Spacing
              </h3>
              <p className="text-gray-600 mb-4">
                Control line and letter spacing for optimal readability
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ✓ Personalized Profiles
              </h3>
              <p className="text-gray-600 mb-4">
                Save your preferences and access them anywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
