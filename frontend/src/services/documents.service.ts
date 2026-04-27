import apiClient from './api.service';

export interface Document {
  id: number;
  title: string;
  content: string;
  category: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsListResponse {
  data: Document[];
  total: number;
  page: number;
  lastPage: number;
}

export interface DashboardStats {
  totalWords: number;
  totalDocuments: number;
  mostUsedCategory: string;
  averageDocumentLength: number;
  lastActivityDate: string | null;
}

export const documentsService = {
  async getAll(page = 1, limit = 10): Promise<DocumentsListResponse> {
    const response = await apiClient.get<DocumentsListResponse>('/documents', {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(id: number): Promise<Document> {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  async create(title: string, content: string, category?: string): Promise<Document> {
    const response = await apiClient.post<Document>('/documents', { title, content, category });
    return response.data;
  },

  async update(id: number, updates: { title?: string; content?: string; category?: string }): Promise<Document> {
    const response = await apiClient.put<Document>(`/documents/${id}`, updates);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/documents/stats/dashboard');
    return response.data;
  },
};
