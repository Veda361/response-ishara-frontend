import { ApiError } from '../types/api';
import type { ApiResponse } from '../types/api';

const getBaseUrl = (): string => {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_API_URL) ||
    'https://reposnse-ishaara.onrender.com';
  return url.replace(/\/+$/, '');
};

const API_BASE_URL = getBaseUrl();

let adminKeyGetter: () => string | null = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isahara_admin_key');
  }
  return null;
};

export const setAdminKeyGetter = (getter: () => string | null) => {
  adminKeyGetter = getter;
};

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, timeoutMs = 25000, headers = {}, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const currentAdminKey = adminKeyGetter();
  if (currentAdminKey) {
    defaultHeaders['x-admin-key'] = currentAdminKey;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        `Request failed with status ${response.status} (${response.statusText})`;
      const errorCode = data?.error?.code || `HTTP_${response.status}`;
      const errorDetails = data?.error?.details;

      throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
    }

    return data as ApiResponse<T>;
  } catch (error: unknown) {
    clearTimeout(timer);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The server might be starting up from cold standby. Please try again.',
        408,
        'TIMEOUT'
      );
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiError(
        'Unable to connect to the backend server. If this is a cross-origin request, the backend CORS configuration must allow this origin.',
        0,
        'NETWORK_ERROR'
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}

export { API_BASE_URL };
