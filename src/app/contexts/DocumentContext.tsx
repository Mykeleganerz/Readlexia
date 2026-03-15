import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  uploadDate: string;
  category: string;
}

interface DocumentContextType {
  documents: Document[];
  addDocument: (title: string, content: string, category: string) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => Document | undefined;
  updateDocument: (id: string, updates: Partial<Document>) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Mock initial documents
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Sample Academic Text',
    content: 'Photosynthesis is a biochemical process that converts carbon dioxide and water into glucose and oxygen using light energy. This fundamental process occurs in plants, algae, and certain bacteria. The chloroplasts within plant cells contain chlorophyll, which captures sunlight and initiates the complex series of chemical reactions.',
    uploadDate: '2026-02-10',
    category: 'Academic',
  },
  {
    id: '2',
    title: 'Reading Comprehension Practice',
    content: 'The ancient civilizations of Mesopotamia developed sophisticated writing systems known as cuneiform. These wedge-shaped characters were inscribed on clay tablets using reed styluses. Archaeological discoveries have revealed that this writing system was used for administrative, literary, and educational purposes throughout the region.',
    uploadDate: '2026-02-12',
    category: 'Educational',
  },
];

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('documents');
    return saved ? JSON.parse(saved) : mockDocuments;
  });

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (title: string, content: string, category: string) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      content,
      uploadDate: new Date().toISOString().split('T')[0],
      category,
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument, deleteDocument, getDocument, updateDocument }}>
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
