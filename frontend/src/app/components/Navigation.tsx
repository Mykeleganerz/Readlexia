import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  FileText,
  Book,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Shield,
} from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          ReaDlexia
        </Link>

        <div className="flex items-center gap-6">
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield size={20} />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/documents"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/documents')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            <span>Documents</span>
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>

          <Link
            to="/help"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/help')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle size={20} />
            <span>Help</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/profile')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User size={20} />
            <span>{user.name}</span>
          </Link>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
