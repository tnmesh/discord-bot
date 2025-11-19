import logger from "../Logger";

export interface ApiOptions {
  headers?: Record<string, string>;
}

const defaultHeaders = {
    'Content-Type': 'application/json',
};

export default abstract class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    options: ApiOptions & { body?: unknown } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = { ...defaultHeaders, ...options.headers };
    const config: RequestInit = {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return null as T;
    } catch (error) {
      logger.error(`API Error: ${error}`);
      throw error;
    }
  }

  public get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, 'GET', options);
  }

  public post<T, D>(endpoint: string, data: D, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, 'POST', { ...options, body: data });
  }

  public put<T, D>(endpoint: string, data: D, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, 'PUT', { ...options, body: data });
  }

  public delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}