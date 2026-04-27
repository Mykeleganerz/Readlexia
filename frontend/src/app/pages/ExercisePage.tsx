import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import {
  exercisesService,
  type Exercise,
} from '../../services/exercises.service';
import { PhonemeSegmentationExercise } from '../components/exercises/PhonemeSegmentationExercise';
import { LetterSoundTracingExercise } from '../components/exercises/LetterSoundTracingExercise';
import { SoundBlendingExercise } from '../components/exercises/SoundBlendingExercise';
import { LetterDiscriminationExercise } from '../components/exercises/LetterDiscriminationExercise';
import { SyllableTypesExercise } from '../components/exercises/SyllableTypesExercise';
import { RapidNamingExercise } from '../components/exercises/RapidNamingExercise';
import { ArrowLeft, Loader, CheckCircle, XCircle } from 'lucide-react';

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        if (!exerciseId) {
          setError('Exercise ID not found');
          return;
        }
        const ex = await exercisesService.getExercise(parseInt(exerciseId));
        setExercise(ex);
      } catch (err) {
        console.error('Error loading exercise:', err);
        setError('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [exerciseId]);

  const handleSubmitAnswer = async (userAnswer: string) => {
    if (!exercise || !exerciseId) return;

    const currentQuestion = exercise.questions[currentQuestionIndex];
    setSubmitting(true);

    try {
      const result = await exercisesService.submitAnswer(
        parseInt(exerciseId),
        currentQuestion.id,
        userAnswer,
      );

      // Update exercise state
      const updatedQuestions = [...exercise.questions];
      updatedQuestions[currentQuestionIndex] = result;
      setExercise({ ...exercise, questions: updatedQuestions });

      // Show feedback
      setFeedback({
        isCorrect: result.isCorrect,
        message: result.explanation,
      });
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (exercise && currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback(null);
    } else {
      // Exercise complete
      navigate(`/exercise-results/${exerciseId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <Loader
            className="mx-auto animate-spin text-blue-600 mb-4"
            size={48}
          />
          <p className="text-gray-600">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-red-600 text-lg">
            {error || 'Exercise not found'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exercise.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              Question {currentQuestionIndex + 1} of {exercise.totalQuestions}
            </h2>
            <span className="text-sm font-semibold text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Exercise Component */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {currentQuestion.type === 'phoneme_segmentation' && (
            <PhonemeSegmentationExercise
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              isSubmitting={submitting}
            />
          )}
          {currentQuestion.type === 'letter_sound_tracing' && (
            <LetterSoundTracingExercise
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              isSubmitting={submitting}
            />
          )}
          {currentQuestion.type === 'sound_blending' && (
            <SoundBlendingExercise
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              isSubmitting={submitting}
            />
          )}
          {currentQuestion.type === 'letter_discrimination' && (
            <LetterDiscriminationExercise
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              isSubmitting={submitting}
            />
          )}
          {currentQuestion.type === 'syllable_types' && (
            <SyllableTypesExercise
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              isSubmitting={submitting}
            />
          )}
          {currentQuestion.type === 'rapid_naming' && (
            <RapidNamingExercise
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              isSubmitting={submitting}
            />
          )}

          {/* Feedback Section */}
          {feedback && (
            <div
              className="mt-8 p-6 rounded-lg border-2"
              style={{
                borderColor: feedback.isCorrect ? '#10b981' : '#ef4444',
                backgroundColor: feedback.isCorrect ? '#f0fdf4' : '#fef2f2',
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                {feedback.isCorrect ? (
                  <CheckCircle
                    className="text-green-600 flex-shrink-0"
                    size={24}
                  />
                ) : (
                  <XCircle className="text-red-600 flex-shrink-0" size={24} />
                )}
                <div>
                  <p
                    className="font-bold"
                    style={{
                      color: feedback.isCorrect ? '#10b981' : '#ef4444',
                    }}
                  >
                    {feedback.isCorrect ? 'Correct!' : 'Not quite right...'}
                  </p>
                  <p className="text-gray-700 mt-2">{feedback.message}</p>
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentQuestionIndex === exercise.totalQuestions - 1
                  ? 'See Results'
                  : 'Next Question'}
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-8">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
