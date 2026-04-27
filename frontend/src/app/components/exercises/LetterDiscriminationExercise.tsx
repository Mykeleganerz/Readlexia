import { useState } from 'react';
import { Loader } from 'lucide-react';
import type { ExerciseQuestion } from '../../../services/exercises.service';

interface Props {
  question: ExerciseQuestion;
  onSubmit: (answer: string) => void;
  feedback: { isCorrect: boolean; message: string } | null;
  isSubmitting: boolean;
}

export function LetterDiscriminationExercise({
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
          👁️ Letter Discrimination
        </h3>
        <p className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </p>
        <p className="text-gray-600">
          Some letters look similar. Study them carefully and find the right
          one.
        </p>
      </div>

      {/* Large letter options for better visual discrimination */}
      <div className="bg-gradient-to-b from-purple-50 to-white rounded-lg p-8 mb-8 border-2 border-purple-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option)}
              disabled={feedback !== null}
              className={`aspect-square rounded-lg border-3 transition-all text-6xl font-bold flex items-center justify-center font-serif ${
                selectedAnswer === option
                  ? 'border-blue-600 bg-blue-100'
                  : 'border-purple-300 hover:border-purple-500 bg-white'
              } ${feedback !== null ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Look at the curves and shapes.
          Similar-looking letters like 'b' and 'd' have different positions.
        </p>
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
