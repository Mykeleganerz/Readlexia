import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../../services/auth.service';
import { storage } from '../../utils/storage';

// Mock the services
vi.mock('../../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
    requestPasswordReset: vi.fn(),
  },
}));

vi.mock('../../utils/storage', () => ({
  storage: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    removeToken: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with no user when no token exists', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('should load user profile when token exists', async () => {
    const mockProfile = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    vi.mocked(storage.getToken).mockReturnValue('mock-token');
    vi.mocked(authService.getProfile).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockProfile);
  });

  it('should handle login successfully', async () => {
    const mockResponse = {
      accessToken: 'new-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      },
    };

    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(authService.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loginResult: boolean = false;
    await act(async () => {
      loginResult = await result.current.login(
        'test@example.com',
        'password123',
      );
    });

    expect(loginResult).toBe(true);
    expect(result.current.user).toEqual(mockResponse.user);
    expect(storage.setToken).toHaveBeenCalledWith('new-token');
  });

  it('should handle login failure', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(authService.login).mockRejectedValue(
      new Error('Invalid credentials'),
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      });
    }).rejects.toThrow('Invalid credentials');

    expect(result.current.user).toBeNull();
  });

  it('should handle registration successfully', async () => {
    const mockResponse = {
      accessToken: 'new-token',
      user: {
        id: 2,
        name: 'New User',
        email: 'new@example.com',
      },
    };

    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(authService.register).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let registerResult: boolean = false;
    await act(async () => {
      registerResult = await result.current.register(
        'New User',
        'new@example.com',
        'password123',
      );
    });

    expect(registerResult).toBe(true);
    expect(result.current.user).toEqual(mockResponse.user);
    expect(storage.setToken).toHaveBeenCalledWith('new-token');
  });

  it('should handle logout', async () => {
    const mockProfile = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    vi.mocked(storage.getToken).mockReturnValue('mock-token');
    vi.mocked(authService.getProfile).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockProfile);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(storage.removeToken).toHaveBeenCalled();
  });

  it('should update profile locally', async () => {
    const mockProfile = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    };

    vi.mocked(storage.getToken).mockReturnValue('mock-token');
    vi.mocked(authService.getProfile).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockProfile);
    });

    act(() => {
      result.current.updateProfile({ name: 'Updated Name' });
    });

    expect(result.current.user?.name).toBe('Updated Name');
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('should handle password reset', async () => {
    vi.mocked(storage.getToken).mockReturnValue(null);
    vi.mocked(authService.requestPasswordReset).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let resetResult: boolean = false;
    await act(async () => {
      resetResult = await result.current.resetPassword('test@example.com');
    });

    expect(resetResult).toBe(true);
    expect(authService.requestPasswordReset).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });
});
