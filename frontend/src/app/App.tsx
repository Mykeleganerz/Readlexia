import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthProvider } from './contexts/AuthContext';
import { DocumentProvider } from './contexts/DocumentContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AccessibilityProvider>
          <DocumentProvider>
            <RouterProvider router={router} />
          </DocumentProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
