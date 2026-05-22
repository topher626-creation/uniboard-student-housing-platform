export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  profileImage?: string;
  role: 'student' | 'provider' | 'admin';
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  isApproved: boolean;
  approvedAt?: string;
  totalListings: number;
  totalBookings: number;
  avgRating: number;
}

export interface Property {
  id: string;
  providerId: string;
  title: string;
  description: string;
  nearestUniversity: string;
  location: string;
  latitude?: number;
  longitude?: number;
  pricePerMonth: number;
  bedType: 'shared' | 'private';
  genderPreference: 'male' | 'female' | 'any';
  availableFrom: string;
  totalRooms: number;
  occupiedRooms: number;
  amenities: string[];
  images: string[];
  isApproved: boolean;
  approvedAt?: string;
  isActive: boolean;
  views: number;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  studentId: string;
  providerId: string;
  checkInDate: string;
  checkOutDate?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  studentId: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'mtn' | 'airtel' | 'proof';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  proofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  studentId: string;
  rating: number;
  comment: string;
  cleanliness: number;
  communication: number;
  accuracy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  studentId: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}
