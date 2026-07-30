import { API_BASE } from './config';
import { getAuthToken } from './authUtils';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const err = await response.json();
      message = err?.error ?? err?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function fetchProperties() {
  return apiFetch<unknown[]>('/properties');
}

export function fetchProperty(id: string) {
  return apiFetch<unknown>(`/properties/${id}`);
}

export function fetchAdminStats() {
  return apiFetch<import('./types/admin').AdminStats>('/admin/stats', { auth: true });
}

export function fetchAdminUsers() {
  return apiFetch<import('./types/admin').AdminUser[]>('/admin/users', { auth: true });
}

export function approveAdminUser(userId: string) {
  return apiFetch<{ message: string }>(`/admin/users/${userId}/approve`, { method: 'PATCH', auth: true });
}

export function rejectAdminUser(userId: string, reason?: string) {
  return apiFetch<{ message: string }>(`/admin/users/${userId}/reject`, {
    method: 'PATCH',
    auth: true,
    body: { reason },
  });
}

export function banAdminUser(userId: string) {
  return apiFetch<{ message: string }>(`/admin/users/${userId}/ban`, { method: 'PATCH', auth: true });
}

export function verifyOtp(userId: string, otp: string) {
  return apiFetch<{ token: string; user: unknown }>('/auth/verify-otp', {
    method: 'POST',
    body: { userId, otp },
  });
}

export function submitContactForm(data: { name: string; email: string; subject: string; message: string }) {
  return apiFetch<{ message: string }>('/contact', { method: 'POST', body: data });
}

export function fetchLandlordOverview() {
  return apiFetch<{
    businessName?: string;
    status: string;
    stats: {
      totalProperties: number;
      totalBedspaces: number;
      occupiedBedspaces: number;
      availableBedspaces: number;
    };
  }>('/landlord/overview', { auth: true });
}

export function fetchLandlordProperties() {
  return apiFetch<unknown[]>('/landlord/properties', { auth: true });
}
