import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthProvider } from './contexts/AuthContext';
import { DocumentProvider } from './contexts/DocumentContext';

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <DocumentProvider>
          <RouterProvider router={router} />
        </DocumentProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}