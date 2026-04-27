import { useState } from 'react';
import { Loader } from 'lucide-react';
import type { ExerciseQuestion } from '../../../services/exercises.service';

interface Props {
  question: ExerciseQuestion;
  onSubmit: (answer: string) => void;
  feedback: { isCorrect: boolean; message: string } | null;
  isSubmitting: boolean;
}

export function LetterSoundTracingExercise({
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
          📝 Letter-Sound Tracing
        </h3>
        <p className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </p>
        <p className="text-gray-600">
          Trace the letter in the air, say its sound aloud, then select it
          below.
        </p>
      </div>

      {/* Visual representation of the letter options */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-8 mb-8 border-2 border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option)}
              disabled={feedback !== null}
              className={`aspect-square rounded-lg border-3 transition-all text-5xl font-bold flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-blue-600 bg-blue-100'
                  : 'border-gray-300 hover:border-blue-400 bg-white'
              } ${feedback !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
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
