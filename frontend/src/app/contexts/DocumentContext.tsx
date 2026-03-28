import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  documentsService,
  Document as ApiDocument,
} from '../../services/documents.service';
import { authService } from '../../services/auth.service';
import { useAuth } from './AuthContext';

export interface Document {
  id: number;
  title: string;
  content: string;
  uploadDate: string;
  category: string;
}

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  addDocument: (
    title: string,
    content: string,
    category: string,
  ) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;
  getDocument: (id: number) => Document | undefined;
  updateDocument: (id: number, updates: Partial<Document>) => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined,
);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load documents when user is authenticated
  useEffect(() => {
    const token = authService.getToken();
    if (user && token) {
      refreshDocuments();
    } else {
      setDocuments([]);
    }
  }, [user]);

  const refreshDocuments = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const response = await documentsService.getAll(1, 100); // Get first 100 documents

      // Transform API documents to match our interface
      const transformedDocs: Document[] = response.data.map(
        (doc: ApiDocument) => ({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          category: doc.category,
          uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
        }),
      );

      setDocuments(transformedDocs);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
      setLoading(false);
      console.error('Failed to load documents:', err);
    }
  };

  const addDocument = async (
    title: string,
    content: string,
    category: string,
  ) => {
    if (!user) {
      setError('You must be logged in to add documents');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newDoc = await documentsService.create(title, content, category);

      // Transform and add to local state
      const transformedDoc: Document = {
        id: newDoc.id,
        title: newDoc.title,
        content: newDoc.content,
        category: newDoc.category,
        uploadDate: new Date(newDoc.createdAt).toISOString().split('T')[0],
      };

      setDocuments((prev) => [transformedDoc, ...prev]);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add document');
      setLoading(false);
      throw err; // Re-throw so UI can handle it
    }
  };

  const deleteDocument = async (id: number) => {
    if (!user) {
      setError('You must be logged in to delete documents');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await documentsService.delete(id);

      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete document',
      );
      setLoading(false);
      throw err;
    }
  };

  const getDocument = (id: number): Document | undefined => {
    return documents.find((doc) => doc.id === id);
  };

  const updateDocument = async (id: number, updates: Partial<Document>) => {
    if (!user) {
      setError('You must be logged in to update documents');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Only send allowed fields to backend
      const { title, content, category } = updates;
      const updatedDoc = await documentsService.update(id, {
        title,
        content,
        category,
      });

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === id) {
            return {
              ...doc,
              title: updatedDoc.title,
              content: updatedDoc.content,
              category: updatedDoc.category,
              uploadDate: new Date(updatedDoc.updatedAt)
                .toISOString()
                .split('T')[0],
            };
          }
          return doc;
        }),
      );

      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update document',
      );
      setLoading(false);
      throw err;
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        error,
        addDocument,
        deleteDocument,
        getDocument,
        updateDocument,
        refreshDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentProvider');
  }
  return context;
}
