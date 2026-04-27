import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import {
  exercisesService,
  type ExerciseStats,
} from '../../services/exercises.service';
import { ArrowLeft, CheckCircle, TrendingUp, Loader } from 'lucide-react';

export function ExerciseResults() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ExerciseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!exerciseId) {
          setError('Exercise ID not found');
          return;
        }
        const exerciseStats = await exercisesService.getExerciseStats(
          parseInt(exerciseId),
        );
        setStats(exerciseStats);
      } catch (err) {
        console.error('Error loading exercise stats:', err);
        setError('Failed to load exercise results');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [exerciseId]);

  const getPerformanceMessage = (percentage: number): string => {
    if (percentage === 100) return 'Perfect Score! 🌟';
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 80) return 'Very Good! 👏';
    if (percentage >= 70) return 'Good Job! 👍';
    if (percentage >= 60) return 'Nice Effort! 💪';
    return 'Keep Practicing! 📚';
  };

  const getPerformanceColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    return 'text-orange-600';
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
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-red-600 text-lg">{error || 'Results not found'}</p>
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

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-2xl p-12 mb-8 text-white text-center">
          <CheckCircle className="mx-auto mb-4" size={64} />
          <h1 className="text-4xl font-bold mb-2">Exercise Complete!</h1>
          <p className="text-blue-100 text-lg mb-8">
            Here's how you performed:
          </p>

          {/* Score Display */}
          <div className="mb-8">
            <div
              className={`text-7xl font-bold mb-3 ${getPerformanceColor(stats.scorePercentage)}`}
            >
              {stats.scorePercentage}%
            </div>
            <p
              className={`text-xl font-semibold ${getPerformanceColor(stats.scorePercentage)}`}
            >
              {getPerformanceMessage(stats.scorePercentage)}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold">{stats.correctAnswers}</div>
                <div className="text-blue-100 text-sm">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {stats.attemptedQuestions - stats.correctAnswers}
                </div>
                <div className="text-blue-100 text-sm">Incorrect</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                <div className="text-blue-100 text-sm">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-green-600" size={24} />
              <h3 className="font-bold text-lg text-gray-800">Your Progress</h3>
            </div>
            <p className="text-gray-600 mb-4">
              You completed {stats.attemptedQuestions} out of{' '}
              {stats.totalQuestions} exercises.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{
                  width: `${(stats.attemptedQuestions / stats.totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200">
            <h3 className="font-bold text-lg text-purple-900 mb-3">
              💡 Pro Tip
            </h3>
            {stats.scorePercentage >= 80 ? (
              <p className="text-purple-800 text-sm">
                Great work! Try the next difficulty level or generate exercises
                from another document to continue improving.
              </p>
            ) : (
              <p className="text-purple-800 text-sm">
                Keep practicing! Each exercise strengthens your reading skills.
                Consider reviewing similar words and try again.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Upload Another Document
          </button>
        </div>

        {/* Performance Tips */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            📚 Research-Backed Tips for Success
          </h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>
                <strong>Practice regularly:</strong> Daily practice (even 15-20
                minutes) is more effective than occasional longer sessions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>
                <strong>Multisensory learning:</strong> Say words aloud, trace
                letters, and visualize sounds to strengthen neural pathways.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>
                <strong>Low-pressure environment:</strong> Don't rush. Stress
                impairs learning. Go at your own pace.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>
                <strong>Track progress:</strong> Keep working on
                documents—you'll see improvement over time!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
