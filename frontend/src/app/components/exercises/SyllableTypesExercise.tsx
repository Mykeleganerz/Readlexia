import { useState } from 'react';
import { Loader } from 'lucide-react';
import type { ExerciseQuestion } from '../../../services/exercises.service';

interface Props {
  question: ExerciseQuestion;
  onSubmit: (answer: string) => void;
  feedback: { isCorrect: boolean; message: string } | null;
  isSubmitting: boolean;
}

export function SyllableTypesExercise({
  question,
  onSubmit,
  feedback,
  isSubmitting,
}: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
    }
  };

  const getSyllableExplanation = (type: string): string => {
    const explanations = {
      Open: 'Ends with a vowel sound (like "go", "we")',
      Closed: 'Ends with a consonant sound (like "cat", "dog")',
      'Silent E': 'Ends with a silent e (like "make", "home")',
      'Vowel Team': 'Has two vowels together (like "sea", "book")',
      'Controlled R': 'Has a vowel followed by r (like "car", "bird")',
      Schwa: 'Has a schwa sound (like "about", "sofa")',
    };
    return explanations[type] || '';
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          📚 Syllable Types
        </h3>
        <p className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </p>
        <p className="text-gray-600">
          Words follow patterns based on how syllables are constructed.
        </p>
      </div>

      {/* Syllable type options with explanations */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            disabled={feedback !== null}
            className={`w-full p-5 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${feedback !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
          >
            <div className="font-bold text-lg text-gray-800">{option}</div>
            <div className="text-sm text-gray-600 mt-1">
              {getSyllableExplanation(option)}
            </div>
          </button>
        ))}
      </div>

      {/* Syllable Type Reference */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 mb-8">
        <h4 className="font-bold text-indigo-900 mb-3">
          📖 Six Syllable Types:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-indigo-800">
          <div>
            • <strong>Open:</strong> Ends with vowel (no, go)
          </div>
          <div>
            • <strong>Closed:</strong> Ends with consonant (cat, sit)
          </div>
          <div>
            • <strong>Silent E:</strong> VCe pattern (make, home)
          </div>
          <div>
            • <strong>Vowel Team:</strong> Two vowels (sea, boat)
          </div>
          <div>
            • <strong>Controlled R:</strong> Vowel+r (car, bird)
          </div>
          <div>
            • <strong>Schwa:</strong> Weak vowel sound (about, sofa)
          </div>
        </div>
      </div>

      {!feedback && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader size={20} className="animate-spin" />}
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
      )}
    </div>
  );
}
