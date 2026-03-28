// Safe localStorage wrapper with error handling

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Clear old data if quota exceeded
        this.clear();
      } else {
        console.error(`Error setting item in localStorage: ${key}`, error);
      }
      return false;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },

  has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking item in localStorage: ${key}`, error);
      return false;
    }
  },

  // Token-specific methods
  getToken(): string | null {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  removeToken(): void {
    try {
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
};
