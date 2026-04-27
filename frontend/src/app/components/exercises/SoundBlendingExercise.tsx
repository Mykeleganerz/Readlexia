import { useState } from 'react';
import { Loader, Volume2 } from 'lucide-react';
import type { ExerciseQuestion } from '../../../services/exercises.service';

interface Props {
  question: ExerciseQuestion;
  onSubmit: (answer: string) => void;
  feedback: { isCorrect: boolean; message: string } | null;
  isSubmitting: boolean;
}

export function SoundBlendingExercise({
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

  const handleSpeak = () => {
    // Extract the sounds from question text and read them out
    const utterance = new SpeechSynthesisUtterance(
      question.question.replace(/[^a-zA-Z\s\/]/g, ''),
    );
    utterance.rate = 0.8; // Slower speech for dyslexic learners
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          🔊 Sound Blending
        </h3>
        <p className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </p>
        <p className="text-gray-600 mb-4">
          Listen to the sounds, blend them together, and select the correct
          word.
        </p>

        {/* Audio Button */}
        <button
          onClick={handleSpeak}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
        >
          <Volume2 size={20} />
          Listen to Sounds
        </button>
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
            <div className="text-xl font-bold text-gray-800">{option}</div>
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
