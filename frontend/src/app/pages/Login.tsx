import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, KeyRound } from 'lucide-react';
import { authService } from '../../services/auth.service';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (!resetEmail || !resetNewPassword) {
      setResetError('Please enter your email and a new password');
      return;
    }

    try {
      // 1. Request reset token
      const res = await authService.requestPasswordReset(resetEmail);
      if (res && res.resetToken) {
        // 2. Immediately use it to set the new password
        await authService.resetPassword(res.resetToken, resetNewPassword);
        setResetMessage(
          'Password has been successfully updated! You can now log in.',
        );
        setResetEmail('');
        setResetNewPassword('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
        }, 3000);
      } else {
        setResetError('Failed to generate reset token. Email may not exist.');
      }
    } catch (err: any) {
      setResetError(
        err.message || 'Failed to reset password. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {user && !loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">You're already logged in!</p>
            <p className="text-sm mt-1">
              <Link to="/dashboard" className="underline hover:text-blue-800">
                Go to Dashboard
              </Link>
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <LogIn className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to ReaDlexia</p>
        </div>

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
              Enter your email address and a new password below to reset your
              password directly.
            </div>
            <div>
              <label
                htmlFor="resetEmail"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="resetNewPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="resetNewPassword"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {resetError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {resetError}
              </div>
            )}
            {resetMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {resetMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound size={18} />
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          {!showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 font-semibold hover:underline text-sm"
              >
                Forgot Password?
              </button>
              <p className="text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </>
          ) : (
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetError('');
                setResetMessage('');
              }}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Back to Login
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
