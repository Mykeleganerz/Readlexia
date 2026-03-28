/**
 * Token Refresh Utility
 * Handles JWT token expiration and automatic refresh
 */

import { storage } from './storage';

interface TokenData {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

export const tokenManager = {
  /**
   * Parse JWT token to get expiration time
   */
  parseToken(token: string): { exp: number } | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  },

  /**
   * Check if token is expired or will expire soon (within 5 minutes)
   */
  isTokenExpired(token: string): boolean {
    const parsed = this.parseToken(token);
    if (!parsed || !parsed.exp) return true;

    const expiresAt = parsed.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return now >= expiresAt - fiveMinutes;
  },

  /**
   * Get token with automatic expiration check
   */
  getValidToken(): string | null {
    const token = storage.getToken();
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      console.warn('Token expired, clearing...');
      storage.removeToken();
      return null;
    }

    return token;
  },

  /**
   * Save token with metadata
   */
  saveToken(token: string): void {
    storage.setToken(token);

    const parsed = this.parseToken(token);
    if (parsed?.exp) {
      // Store expiration time for quick checks
      localStorage.setItem('tokenExpiresAt', (parsed.exp * 1000).toString());
    }
  },

  /**
   * Clear all token data
   */
  clearToken(): void {
    storage.removeToken();
    localStorage.removeItem('tokenExpiresAt');
  },

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(): number | null {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!expiresAt) return null;

    return parseInt(expiresAt) - Date.now();
  },

  /**
   * Check if user should be warned about expiring session
   * Returns true if token expires in less than 10 minutes
   */
  shouldWarnExpiration(): boolean {
    const timeUntil = this.getTimeUntilExpiry();
    if (!timeUntil) return false;

    const tenMinutes = 10 * 60 * 1000;
    return timeUntil > 0 && timeUntil < tenMinutes;
  },
};

/**
 * Hook to monitor token expiration (use in App.tsx)
 */
export function useTokenExpirationMonitor(
  onExpired: () => void,
  onExpiringSoon?: () => void
): void {
  if (typeof window === 'undefined') return;

  // Check every minute
  const interval = setInterval(() => {
    const token = storage.getToken();
    if (!token) return;

    if (tokenManager.isTokenExpired(token)) {
      console.log('Token expired, triggering logout');
      tokenManager.clearToken();
      onExpired();
      clearInterval(interval);
      return;
    }

    if (onExpiringSoon && tokenManager.shouldWarnExpiration()) {
      onExpiringeSoon();
    }
  }, 60000); // Check every minute

  // Cleanup on unmount
  return () => clearInterval(interval);
}

/**
 * Auto-logout utility for session timeout
 */
export class SessionTimeoutManager {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningTimeoutId: NodeJS.Timeout | null = null;
  private readonly inactivityPeriod: number;
  private readonly warningPeriod: number;
  private onTimeout: () => void;
  private onWarning?: () => void;

  constructor(
    inactivityMinutes: number = 30,
    warningMinutes: number = 5,
    onTimeout: () => void,
    onWarning?: () => void
  ) {
    this.inactivityPeriod = inactivityMinutes * 60 * 1000;
    this.warningPeriod = warningMinutes * 60 * 1000;
    this.onTimeout = onTimeout;
    this.onWarning = onWarning;
  }

  public start(): void {
    this.reset();
    this.addEventListeners();
  }

  public stop(): void {
    this.removeEventListeners();
    this.clearTimeouts();
  }

  public reset(): void {
    this.clearTimeouts();

    // Set warning timeout (e.g., 25 minutes)
    if (this.onWarning) {
      this.warningTimeoutId = setTimeout(() => {
        this.onWarning?.();
      }, this.inactivityPeriod - this.warningPeriod);
    }

    // Set logout timeout (e.g., 30 minutes)
    this.timeoutId = setTimeout(() => {
      this.onTimeout();
      this.stop();
    }, this.inactivityPeriod);
  }

  private clearTimeouts(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }

  private addEventListeners(): void {
    // Reset timer on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, this.handleActivity);
    });
  }

  private removeEventListeners(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, this.handleActivity);
    });
  }

  private handleActivity = (): void => {
    this.reset();
  };
}
