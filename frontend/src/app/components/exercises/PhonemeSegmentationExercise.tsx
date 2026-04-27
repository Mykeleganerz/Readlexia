import { useState } from 'react';
import { Loader } from 'lucide-react';
import type { ExerciseQuestion } from '../../../services/exercises.service';

interface Props {
  question: ExerciseQuestion;
  onSubmit: (answer: string) => void;
  feedback: { isCorrect: boolean; message: string } | null;
  isSubmitting: boolean;
}

export function PhonemeSegmentationExercise({
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

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          🔤 Phoneme Segmentation
        </h3>
        <p className="text-2xl font-bold text-gray-800">{question.question}</p>
        <p className="text-gray-600 mt-2">
          Break down the word into its individual sounds.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(option)}
            disabled={feedback !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${feedback !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
          >
            <div className="font-semibold text-gray-800">{option}</div>
          </button>
        ))}
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
