import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { DocumentView } from './pages/DocumentView';
import { Reader } from './pages/Reader';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUserManagement } from './pages/AdminUserManagement';
import { ExerciseSelector } from './pages/ExerciseSelector';
import { ExercisePage } from './pages/ExercisePage';
import { ExerciseResults } from './pages/ExerciseResults';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute>
        <AdminUserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/documents',
    element: (
      <ProtectedRoute>
        <DocumentView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reader/:documentId',
    element: (
      <ProtectedRoute>
        <Reader />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercise-selector/:documentId',
    element: (
      <ProtectedRoute>
        <ExerciseSelector />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercise/:exerciseId',
    element: (
      <ProtectedRoute>
        <ExercisePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercise-results/:exerciseId',
    element: (
      <ProtectedRoute>
        <ExerciseResults />
      </ProtectedRoute>
    ),
  },
  {
    path: '/help',
    element: <Help />,
  },
]);
