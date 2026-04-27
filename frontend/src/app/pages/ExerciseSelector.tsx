import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { exercisesService } from '../../services/exercises.service';
import { documentsService } from '../../services/documents.service';
import { ArrowLeft, BookOpen, Loader } from 'lucide-react';
import type { Document } from '../../services/documents.service';

export function ExerciseSelector() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [numberOfExercises, setNumberOfExercises] = useState(5);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        if (!documentId) {
          setError('Document ID not found');
          return;
        }
        const doc = await documentsService.getById(parseInt(documentId));
        setDocument(doc);
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  const handleGenerateExercise = async () => {
    if (!documentId) return;

    setGenerating(true);
    setError(null);

    try {
      const exercise = await exercisesService.generateExercise(
        parseInt(documentId),
        numberOfExercises,
      );
      navigate(`/exercise/${exercise.id}`);
    } catch (err) {
      console.error('Error generating exercise:', err);
      setError('Failed to generate exercise. Please try again.');
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <Loader
            className="mx-auto animate-spin text-blue-600 mb-4"
            size={48}
          />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Document Info */}
        {document && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {document.title}
                </h1>
                <p className="text-gray-600">
                  Category:{' '}
                  <span className="font-semibold">{document.category}</span>
                </p>
                <p className="text-gray-600">
                  Words:{' '}
                  <span className="font-semibold">
                    {document.content.split(/\s+/).length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Generate Dyslexia-Friendly Exercises
          </h2>

          <p className="text-gray-600 mb-8">
            Our exercises are based on evidence-based dyslexia intervention
            strategies. We'll extract words from your document and create a mix
            of phonological awareness, letter discrimination, and fluency
            exercises to help you improve reading skills.
          </p>

          {/* Exercise Count Selector */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              How many exercises would you like? (1-50)
            </label>

            <div className="flex flex-col gap-4">
              {/* Slider */}
              <input
                type="range"
                min="1"
                max="50"
                value={numberOfExercises}
                onChange={(e) => setNumberOfExercises(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />

              {/* Number Display and Quick Select */}
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-blue-600">
                  {numberOfExercises}
                </div>
                <div className="flex gap-2">
                  {[5, 10, 15, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumberOfExercises(num)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                        numberOfExercises === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Estimate */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ⏱️ Estimated time:{' '}
                  <span className="font-semibold">
                    {Math.ceil(numberOfExercises * 1.5)} minutes
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Exercise Types Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-purple-900 mb-3">Exercise Types:</h3>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>
                🔤 <span className="font-semibold">Phoneme Segmentation</span> -
                Identify sounds in words
              </li>
              <li>
                📝 <span className="font-semibold">Letter-Sound Tracing</span> -
                Learn letter sounds
              </li>
              <li>
                🔊 <span className="font-semibold">Sound Blending</span> - Blend
                sounds to form words
              </li>
              <li>
                👁️ <span className="font-semibold">Letter Discrimination</span>{' '}
                - Distinguish similar letters
              </li>
              <li>
                📚 <span className="font-semibold">Syllable Types</span> -
                Understand syllable patterns
              </li>
              <li>
                ⚡ <span className="font-semibold">Rapid Naming</span> - Build
                processing speed
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateExercise}
            disabled={generating}
            className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating && <Loader size={20} className="animate-spin" />}
            {generating ? 'Generating Exercises...' : 'Start Exercises'}
          </button>
        </div>
      </div>
    </div>
  );
}
