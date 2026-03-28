import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { DocumentProvider, useDocuments } from './DocumentContext';
import { AuthProvider } from './AuthContext';
import { documentsService } from '../../services/documents.service';
import { storage } from '../../utils/storage';

// Mock the services
vi.mock('../../services/documents.service', () => ({
  documentsService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../services/auth.service', () => ({
  authService: {
    getProfile: vi.fn(),
  },
}));

vi.mock('../../utils/storage', () => ({
  storage: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    removeToken: vi.fn(),
  },
}));

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

const mockDocuments = [
  {
    id: 1,
    title: 'Test Document 1',
    content: 'Content 1',
    category: 'Education',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    userId: 1,
  },
  {
    id: 2,
    title: 'Test Document 2',
    content: 'Content 2',
    category: 'Personal',
    createdAt: '2024-01-16T10:00:00.000Z',
    updatedAt: '2024-01-16T10:00:00.000Z',
    userId: 1,
  },
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <DocumentProvider>{children}</DocumentProvider>
  </AuthProvider>
);

describe('DocumentContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getToken).mockReturnValue('mock-token');
  });

  it('should initialize with empty documents when no user', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.documents).toEqual([]);
  });

  it('should load documents when user is authenticated', async () => {
    vi.mocked(documentsService.getAll).mockResolvedValue({
      data: mockDocuments,
      meta: {
        total: 2,
        page: 1,
        limit: 100,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    expect(result.current.documents[0].title).toBe('Test Document 1');
    expect(result.current.documents[1].title).toBe('Test Document 2');
  });

  it('should add document', async () => {
    const newDoc = {
      id: 3,
      title: 'New Document',
      content: 'New Content',
      category: 'Work',
      createdAt: '2024-01-17T10:00:00.000Z',
      updatedAt: '2024-01-17T10:00:00.000Z',
      userId: 1,
    };

    vi.mocked(documentsService.getAll).mockResolvedValue({
      data: mockDocuments,
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    vi.mocked(documentsService.create).mockResolvedValue(newDoc);

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    await act(async () => {
      await result.current.addDocument('New Document', 'New Content', 'Work');
    });

    expect(result.current.documents.length).toBe(3);
    expect(result.current.documents[0].title).toBe('New Document');
  });

  it('should delete document', async () => {
    vi.mocked(documentsService.getAll).mockResolvedValue({
      data: mockDocuments,
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    vi.mocked(documentsService.delete).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    await act(async () => {
      await result.current.deleteDocument('1');
    });

    expect(result.current.documents.length).toBe(1);
    expect(result.current.documents[0].id).toBe('2');
  });

  it('should update document', async () => {
    vi.mocked(documentsService.getAll).mockResolvedValue({
      data: mockDocuments,
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    const updatedDoc = {
      ...mockDocuments[0],
      title: 'Updated Title',
      content: 'Updated Content',
    };

    vi.mocked(documentsService.update).mockResolvedValue(updatedDoc);

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    await act(async () => {
      await result.current.updateDocument('1', {
        title: 'Updated Title',
        content: 'Updated Content',
      });
    });

    const doc = result.current.getDocument('1');
    expect(doc?.title).toBe('Updated Title');
    expect(doc?.content).toBe('Updated Content');
  });

  it('should get document by id', async () => {
    vi.mocked(documentsService.getAll).mockResolvedValue({
      data: mockDocuments,
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    const doc = result.current.getDocument('1');
    expect(doc?.title).toBe('Test Document 1');
  });

  it('should return undefined for non-existent document', async () => {
    vi.mocked(documentsService.getAll).mockResolvedValue({
      data: mockDocuments,
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    const doc = result.current.getDocument('999');
    expect(doc).toBeUndefined();
  });

  it('should refresh documents', async () => {
    vi.mocked(documentsService.getAll)
      .mockResolvedValueOnce({
        data: mockDocuments,
        meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
      })
      .mockResolvedValueOnce({
        data: [mockDocuments[0]],
        meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
      });

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.documents.length).toBe(2);
    });

    await act(async () => {
      await result.current.refreshDocuments();
    });

    expect(result.current.documents.length).toBe(1);
  });

  it('should throw error when adding document without auth', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useDocuments(), {
      wrapper: Wrapper,
    });

    await expect(async () => {
      await act(async () => {
        await result.current.addDocument('Test', 'Content', 'Category');
      });
    }).rejects.toThrow('Must be logged in to add documents');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useDocuments());
    }).toThrow('useDocuments must be used within DocumentProvider');
  });
});
