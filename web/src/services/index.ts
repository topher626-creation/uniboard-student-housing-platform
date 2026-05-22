import api from './api.js';

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const propertyService = {
  getAll: (filters?: any) => api.get('/properties', { params: filters }),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

export const providerService = {
  create: (data: any) => api.post('/providers', data),
  getMyProfile: () => api.get('/providers/my-profile'),
  getById: (id: string) => api.get(`/providers/${id}`),
  getApproved: () => api.get('/providers/approved'),
  update: (id: string, data: any) => api.put(`/providers/${id}`, data),
};

export const bookingService = {
  create: (propertyId: string, data: any) =>
    api.post(`/bookings/${propertyId}`, data),
  getById: (id: string) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my/bookings'),
  getProviderBookings: () => api.get('/bookings/provider/bookings'),
  confirm: (id: string) => api.patch(`/bookings/${id}/confirm`),
  reject: (id: string) => api.patch(`/bookings/${id}/reject`),
  complete: (id: string) => api.patch(`/bookings/${id}/complete`),
};

export const paymentService = {
  create: (bookingId: string, data: any) =>
    api.post(`/payments/${bookingId}`, data),
  getById: (id: string) => api.get(`/payments/${id}`),
  uploadProof: (id: string, proofUrl: string) =>
    api.post(`/payments/${id}/upload-proof`, { proofUrl }),
};

export const reviewService = {
  create: (bookingId: string, propertyId: string, data: any) =>
    api.post(`/reviews/${bookingId}/${propertyId}`, data),
  getByProperty: (propertyId: string) =>
    api.get(`/reviews/property/${propertyId}`),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export const favoriteService = {
  add: (propertyId: string) => api.post(`/favorites/${propertyId}`),
  remove: (propertyId: string) => api.delete(`/favorites/${propertyId}`),
  getAll: () => api.get('/favorites'),
};

export const adminService = {
  approveProvider: (providerId: string) =>
    api.patch(`/admin/providers/${providerId}/approve`),
  disableProvider: (providerId: string) =>
    api.patch(`/admin/providers/${providerId}/disable`),
  approveProperty: (propertyId: string) =>
    api.patch(`/admin/properties/${propertyId}/approve`),
  blockUser: (userId: string) => api.patch(`/admin/users/${userId}/block`),
  getPendingProviders: () => api.get('/admin/providers/pending'),
  getPendingProperties: () => api.get('/admin/properties/pending'),
  getReports: () => api.get('/admin/reports'),
  resolveReport: (reportId: string) => api.patch(`/admin/reports/${reportId}/resolve`),
};

export const reportService = {
  create: (data: any) => api.post('/reports', data),
};
