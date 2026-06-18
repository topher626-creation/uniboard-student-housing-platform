/** Central API configuration — override via NEXT_PUBLIC_API_URL in production. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

export const UPLOADS_BASE =
  process.env.NEXT_PUBLIC_UPLOADS_URL ??
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export const IS_DEV = process.env.NODE_ENV === 'development';
