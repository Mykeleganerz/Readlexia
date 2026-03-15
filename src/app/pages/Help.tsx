import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';
import { Book, Eye, FileText, Settings, HelpCircle, ChevronRight } from 'lucide-react';

export function Help() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const tutorials = [
    {
      icon: <FileText className="text-blue-600" size={32} />,
      title: 'Uploading Documents',
      description: 'Learn how to upload and organize your reading materials',
      steps: [
        'Navigate to the Documents page from the main menu',
        'Click the "Upload Document" button',
        'Choose a .txt file or paste text directly',
        'Add a title and select a category',
        'Click "Add Document" to save',
      ],
    },
    {
      icon: <Eye className="text-green-600" size={32} />,
      title: 'Using the Reading Ruler',
      description: 'Master the cursor-following reading ruler feature',
      steps: [
        'Open any document in the Reader',
        'Move your mouse cursor over the text',
        'The reading ruler will follow your cursor automatically',
        'Adjust ruler height in Settings for comfort',
        'Toggle the ruler on/off in Quick Settings',
      ],
    },
    {
      icon: <Book className="text-purple-600" size={32} />,
      title: 'Syllable Splitter',
      description: 'Understand how the automatic syllable splitter works',
      steps: [
        'The syllable splitter is enabled by default',
        'Complex words (7+ letters) are automatically split',
        'Syllables are color-coded for easy identification',
        'Toggle this feature in the Settings page',
        'Works in real-time as you read',
      ],
    },
    {
      icon: <Settings className="text-orange-600" size={32} />,
      title: 'Customizing Settings',
      description: 'Personalize your reading experience',
      steps: [
        'Go to Settings from the navigation menu',
        'Choose between OpenDyslexic or Arial font',
        'Adjust font size using the slider (12-32px)',
        'Set line spacing for comfortable reading',
        'Select a color scheme that works for you',
      ],
    },
  ];

  const faqs = [
    {
      question: 'What is OpenDyslexic font?',
      answer: 'OpenDyslexic is a specially designed font that helps prevent letter confusion and improves reading for people with dyslexia. The letters have weighted bottoms to prevent rotation and flipping.',
    },
    {
      question: 'How does the reading ruler help?',
      answer: 'The reading ruler highlights the line you\'re reading, helping you maintain focus and prevent losing your place. It follows your cursor automatically and can be customized in height and color.',
    },
    {
      question: 'Can I adjust the spacing between letters?',
      answer: 'Yes! Go to Settings and use the Letter Spacing slider to increase or decrease the space between letters. Research shows that increased letter spacing can improve reading speed for people with dyslexia.',
    },
    {
      question: 'What file formats are supported?',
      answer: 'Currently, the platform supports .txt (plain text) files. You can also paste text directly into the upload form. Support for more formats is coming soon.',
    },
    {
      question: 'Are my documents and settings saved?',
      answer: 'Yes, all your documents and accessibility settings are saved locally in your browser. Your preferences will persist across sessions.',
    },
    {
      question: 'Which color scheme should I use?',
      answer: 'This depends on personal preference. Light theme is standard, Dark theme reduces eye strain in low light, High Contrast maximizes readability, and Beige provides a warm, comfortable reading experience.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Help & Support</h1>
          <p className="text-gray-600">Tutorials and frequently asked questions</p>
        </div>

        {/* Tutorials Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tutorials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {tutorial.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600">{tutorial.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {tutorial.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {stepIndex + 1}
                      </div>
                      <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Quick Tips for Better Reading</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <ChevronRight size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Take Regular Breaks</h4>
                <p className="text-blue-100">Rest your eyes every 20-30 minutes to reduce fatigue</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Experiment with Settings</h4>
                <p className="text-blue-100">Try different fonts and color schemes to find what works best</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Use the Reading Ruler</h4>
                <p className="text-blue-100">Follow along with your cursor to maintain focus</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ChevronRight size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold mb-1">Adjust Line Spacing</h4>
                <p className="text-blue-100">Increased spacing can significantly improve reading comfort</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Need More Help?</h3>
          <p className="text-blue-800 mb-4">
            If you have additional questions or need personalized support, please don't hesitate to reach out.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
