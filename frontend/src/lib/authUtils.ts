import type { UserRole, AuthUser } from './authContext';

const ROLE_MAP: Record<string, UserRole> = {
  STUDENT: 'student',
  LANDLORD: 'landlord',
  ADMIN: 'admin',
  MANAGER: 'landlord',
  AGENT: 'landlord',
  student: 'student',
  landlord: 'landlord',
  admin: 'admin',
};

export function normalizeRole(role: string | undefined): UserRole {
  if (!role) return 'student';
  return ROLE_MAP[role] ?? ROLE_MAP[role.toUpperCase()] ?? 'student';
}

export function normalizeUser(raw: Record<string, unknown>): AuthUser {
  return {
    id: String(raw.id ?? ''),
    fullName: String(raw.fullName ?? ''),
    email: String(raw.email ?? ''),
    role: normalizeRole(String(raw.role ?? 'student')),
    compoundName: raw.compoundName ? String(raw.compoundName) : undefined,
    university: raw.university ? String(raw.university) : undefined,
    phone: raw.phone ? String(raw.phone) : undefined,
    avatar: raw.avatar ? String(raw.avatar) : undefined,
  };
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'landlord':
      return '/landlord-dashboard';
    default:
      return '/student-dashboard';
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('uniboard_token');
}
