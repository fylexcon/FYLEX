import type { AuthTokens } from '@fylex/shared';
import { useSessionStore } from '@/state/session-store';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:4000';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = useSessionStore.getState().tokens?.accessToken;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.auth !== false && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/v1${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export function setSession(user: unknown, tokens: AuthTokens) {
  useSessionStore.getState().setSession(user, tokens);
}
