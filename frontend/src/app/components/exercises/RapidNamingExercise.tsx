import { useState, useEffect } from 'react';
import { Loader, Zap } from 'lucide-react';
import type { ExerciseQuestion } from '../../../services/exercises.service';

interface Props {
  question: ExerciseQuestion;
  onSubmit: (answer: string) => void;
  feedback: { isCorrect: boolean; message: string } | null;
  isSubmitting: boolean;
}

export function RapidNamingExercise({
  question,
  onSubmit,
  feedback,
  isSubmitting,
}: Props) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    if (!startTime && !submitted) {
      setStartTime(Date.now());
    }
  }, [startTime, submitted]);

  useEffect(() => {
    if (!startTime || submitted) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor(((Date.now() - startTime) / 1000) * 100) / 100);
    }, 10);

    return () => clearInterval(interval);
  }, [startTime, submitted]);

  const handleSubmit = () => {
    setSubmitted(true);
    setElapsedTime(
      Math.floor(((Date.now() - (startTime || 0)) / 1000) * 100) / 100,
    );
    onSubmit(userAnswer || question.correctAnswer);
  };

  const getSpeedFeedback = (time: number): string => {
    if (time < 1) return '⚡ Incredibly fast!';
    if (time < 2) return '🚀 Very fast!';
    if (time < 3) return '👍 Good pace!';
    return '💪 Keep practicing!';
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          ⚡ Rapid Automatized Naming
        </h3>
        <p className="text-gray-600 mb-6">
          This exercise builds processing speed. Say (or type) the word as fast
          as you can!
        </p>

        {/* Timer Display */}
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-6 mb-6 border-2 border-orange-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-semibold">
              ⏱️ Time Elapsed:
            </span>
            <div className="text-5xl font-bold text-orange-600 font-mono">
              {elapsedTime.toFixed(2)}s
            </div>
          </div>
          <p className="text-orange-800 text-sm">
            {startTime && !submitted && getSpeedFeedback(elapsedTime)}
          </p>
        </div>
      </div>

      {/* Large Display of the Word */}
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg p-12 mb-8 border-3 border-blue-300 text-center">
        <p className="text-gray-500 text-sm mb-2 uppercase tracking-wide">
          Say this word:
        </p>
        <p className="text-7xl font-bold text-blue-600 font-sans break-words">
          {question.options[0]}
        </p>
      </div>

      {/* Input Field for typing answer */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Type or say the word:
        </label>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type the word you see..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
          disabled={submitted || feedback !== null}
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-900 text-sm">
          🎯 <strong>Try this:</strong> Read the word aloud first, then submit.
          The faster you recognize and name it, the better you're building
          automaticity!
        </p>
      </div>

      {!feedback && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isSubmitting && <Loader size={20} className="animate-spin" />}
          {isSubmitting ? 'Checking...' : 'I Said It! Submit'}
        </button>
      )}

      {submitted && feedback && (
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 mb-2">
            Speed: {getSpeedFeedback(elapsedTime)}
          </p>
        </div>
      )}
    </div>
  );
}
