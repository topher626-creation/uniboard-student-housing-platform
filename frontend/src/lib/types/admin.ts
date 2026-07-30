export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  phoneVerified: boolean;
  createdAt: string;
  compoundName?: string | null;
  nrcImages?: unknown;
};

export type AdminStats = {
  totalUsers: number;
  activeListings: number;
  verifiedProviders: number;
  pendingVerifications: number;
};
