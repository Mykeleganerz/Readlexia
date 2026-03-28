/**
 * Offline Mode Manager
 * Handles offline document caching and sync when connection is restored
 */

import { Document } from '../app/contexts/DocumentContext';

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  documentId?: string;
  data?: Partial<Document>;
  timestamp: number;
}

export class OfflineManager {
  private static readonly CACHE_KEY = 'offline_documents';
  private static readonly PENDING_KEY = 'pending_actions';
  private static readonly LAST_SYNC_KEY = 'last_sync';

  /**
   * Check if browser is online
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Cache documents for offline access
   */
  static cacheDocuments(documents: Document[]): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(documents));
      localStorage.setItem(this.LAST_SYNC_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to cache documents:', error);
    }
  }

  /**
   * Get cached documents
   */
  static getCachedDocuments(): Document[] {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to retrieve cached documents:', error);
      return [];
    }
  }

  /**
   * Get last sync time
   */
  static getLastSyncTime(): Date | null {
    const timestamp = localStorage.getItem(this.LAST_SYNC_KEY);
    return timestamp ? new Date(parseInt(timestamp)) : null;
  }

  /**
   * Add pending action to queue
   */
  static addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): void {
    try {
      const pending = this.getPendingActions();
      const newAction: PendingAction = {
        ...action,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      pending.push(newAction);
      localStorage.setItem(this.PENDING_KEY, JSON.stringify(pending));
    } catch (error) {
      console.error('Failed to add pending action:', error);
    }
  }

  /**
   * Get all pending actions
   */
  static getPendingActions(): PendingAction[] {
    try {
      const pending = localStorage.getItem(this.PENDING_KEY);
      return pending ? JSON.parse(pending) : [];
    } catch (error) {
      console.error('Failed to retrieve pending actions:', error);
      return [];
    }
  }

  /**
   * Clear pending actions
   */
  static clearPendingActions(): void {
    localStorage.removeItem(this.PENDING_KEY);
  }

  /**
   * Remove specific pending action
   */
  static removePendingAction(actionId: string): void {
    try {
      const pending = this.getPendingActions();
      const filtered = pending.filter(action => action.id !== actionId);
      localStorage.setItem(this.PENDING_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove pending action:', error);
    }
  }

  /**
   * Apply pending action to cached documents
   */
  static applyActionLocally(action: PendingAction): void {
    const cached = this.getCachedDocuments();

    switch (action.type) {
      case 'create':
        if (action.data) {
          cached.unshift(action.data as Document);
        }
        break;
      case 'update':
        if (action.documentId && action.data) {
          const index = cached.findIndex(doc => doc.id === action.documentId);
          if (index !== -1) {
            cached[index] = { ...cached[index], ...action.data };
          }
        }
        break;
      case 'delete':
        if (action.documentId) {
          const index = cached.findIndex(doc => doc.id === action.documentId);
          if (index !== -1) {
            cached.splice(index, 1);
          }
        }
        break;
    }

    this.cacheDocuments(cached);
  }

  /**
   * Get conflict information if document was modified both online and offline
   */
  static detectConflicts(
    serverDoc: Document,
    localDoc: Document
  ): { hasConflict: boolean; fields: string[] } {
    const conflicts: string[] = [];

    if (serverDoc.title !== localDoc.title) conflicts.push('title');
    if (serverDoc.content !== localDoc.content) conflicts.push('content');
    if (serverDoc.category !== localDoc.category) conflicts.push('category');

    return {
      hasConflict: conflicts.length > 0,
      fields: conflicts,
    };
  }

  /**
   * Clear all offline data
   */
  static clearAll(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.PENDING_KEY);
    localStorage.removeItem(this.LAST_SYNC_KEY);
  }
}

/**
 * Hook to enable offline mode
 */
export function useOfflineMode(
  documents: Document[],
  onSync?: (pendingCount: number) => void
) {
  if (typeof window === 'undefined') return;

  // Cache documents when online
  if (OfflineManager.isOnline()) {
    OfflineManager.cacheDocuments(documents);
  }

  // Listen for online/offline events
  const handleOnline = () => {
    console.log('Connection restored, syncing...');
    const pending = OfflineManager.getPendingActions();
    onSync?.(pending.length);
  };

  const handleOffline = () => {
    console.log('Connection lost, offline mode enabled');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Sync manager for retrying failed requests
 */
export class SyncManager {
  private static syncing = false;

  /**
   * Sync all pending actions with server
   * Returns number of successfully synced actions
   */
  static async syncPendingActions(
    createFn: (data: any) => Promise<any>,
    updateFn: (id: string, data: any) => Promise<any>,
    deleteFn: (id: string) => Promise<any>
  ): Promise<{ success: number; failed: number }> {
    if (this.syncing) {
      console.log('Sync already in progress');
      return { success: 0, failed: 0 };
    }

    this.syncing = true;
    const pending = OfflineManager.getPendingActions();
    let success = 0;
    let failed = 0;

    for (const action of pending) {
      try {
        switch (action.type) {
          case 'create':
            await createFn(action.data);
            break;
          case 'update':
            if (action.documentId) {
              await updateFn(action.documentId, action.data);
            }
            break;
          case 'delete':
            if (action.documentId) {
              await deleteFn(action.documentId);
            }
            break;
        }
        OfflineManager.removePendingAction(action.id);
        success++;
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        failed++;
      }
    }

    this.syncing = false;
    return { success, failed };
  }

  /**
   * Check if sync is in progress
   */
  static isSyncing(): boolean {
    return this.syncing;
  }
}
