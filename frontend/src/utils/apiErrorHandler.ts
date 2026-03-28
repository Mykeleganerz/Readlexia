/**
 * API Error Handler with Retry Logic
 * Handles network errors, timeouts, and implements exponential backoff
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: AxiosError) => boolean;
  onRetry?: (retryCount: number, error: AxiosError) => void;
}

export class ApiError extends Error {
  public statusCode?: number;
  public code?: string;
  public isNetworkError: boolean;
  public isTimeout: boolean;
  public isServerError: boolean;
  public isClientError: boolean;
  public details?: any;

  constructor(message: string, error?: AxiosError) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = error?.response?.status;
    this.code = error?.code;
    this.details = error?.response?.data;

    this.isNetworkError = !error?.response && error?.code === 'ERR_NETWORK';
    this.isTimeout = error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT';
    this.isServerError = !!this.statusCode && this.statusCode >= 500;
    this.isClientError = !!this.statusCode && this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is retryable
   */
  public isRetryable(): boolean {
    // Retry on network errors, timeouts, and 5xx errors
    if (this.isNetworkError || this.isTimeout || this.isServerError) {
      return true;
    }

    // Don't retry client errors (4xx) except for specific cases
    if (this.statusCode === 429) return true; // Rate limit
    if (this.statusCode === 408) return true; // Request timeout

    return false;
  }

  /**
   * Get user-friendly error message
   */
  public getUserMessage(): string {
    if (this.isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (this.isTimeout) {
      return 'The request took too long. Please try again.';
    }

    if (this.statusCode === 401) {
      return 'Your session has expired. Please log in again.';
    }

    if (this.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (this.statusCode === 404) {
      return 'The requested resource was not found.';
    }

    if (this.statusCode === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (this.isServerError) {
      return 'A server error occurred. Please try again later.';
    }

    // Use details if available
    if (this.details?.message) {
      return this.details.message;
    }

    return this.message || 'An unexpected error occurred.';
  }
}

/**
 * Exponential backoff delay calculator
 */
export function getExponentialDelay(retryCount: number, baseDelay: number = 1000): number {
  // 1s, 2s, 4s, 8s, 16s...
  const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Max 30 seconds
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 1000;
  return delay + jitter;
}

/**
 * Retry wrapper for axios requests
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryCondition,
    onRetry,
  } = config;

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(
        'Request failed',
        error as AxiosError
      );

      lastError = apiError;

      // Check if we should retry
      const shouldRetry = retryCondition
        ? retryCondition(error as AxiosError)
        : apiError.isRetryable();

      if (!shouldRetry || attempt === maxRetries) {
        throw apiError;
      }

      // Calculate delay and notify
      const delay = getExponentialDelay(attempt, retryDelay);
      onRetry?.(attempt + 1, error as AxiosError);

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Request queue for managing concurrent requests
 */
export class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private readonly maxConcurrent: number;

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Add request to queue
   */
  public async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  /**
   * Process queued requests
   */
  private async process(): Promise<void> {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const request = this.queue.shift();

    if (request) {
      try {
        await request();
      } finally {
        this.running--;
        this.process();
      }
    }
  }

  /**
   * Get queue size
   */
  public size(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  public clear(): void {
    this.queue = [];
  }
}

/**
 * Circuit breaker pattern to prevent cascading failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000, // 1 minute
    private readonly resetTimeout: number = 10000 // 10 seconds
  ) {}

  /**
   * Execute request through circuit breaker
   */
  public async execute<T>(requestFn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new ApiError('Circuit breaker is OPEN. Service temporarily unavailable.');
      }
    }

    try {
      const result = await requestFn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful request
   */
  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  /**
   * Handle failed request
   */
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      console.warn(`Circuit breaker opened after ${this.failures} failures`);
    }
  }

  /**
   * Check if we should attempt to reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false;
    return Date.now() - this.lastFailureTime >= this.resetTimeout;
  }

  /**
   * Get current state
   */
  public getState(): string {
    return this.state;
  }

  /**
   * Manually reset circuit breaker
   */
  public reset(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }
}

/**
 * Create enhanced axios instance with error handling
 */
export function createResilientAxios(baseConfig: AxiosRequestConfig = {}) {
  const instance = axios.create(baseConfig);
  const circuitBreaker = new CircuitBreaker();
  const requestQueue = new RequestQueue();

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    response => response,
    async error => {
      const apiError = new ApiError('Request failed', error);
      throw apiError;
    }
  );

  // Wrap request with circuit breaker and queue
  const originalRequest = instance.request.bind(instance);
  instance.request = async function <T>(config: AxiosRequestConfig): Promise<T> {
    return requestQueue.add(() =>
      circuitBreaker.execute(() => originalRequest(config))
    );
  };

  return {
    instance,
    circuitBreaker,
    requestQueue,
  };
}

/**
 * Batch request helper
 */
export async function batchRequests<T>(
  requests: Array<() => Promise<T>>,
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(req => req()));
    results.push(...batchResults);
  }

  return results;
}
