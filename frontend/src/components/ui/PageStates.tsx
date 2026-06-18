'use client';

import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

type Props = {
  message?: string;
};

export function PageLoader({ message = 'Loading...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-green-700 mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

type ErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function PageError({ message, onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-red-100">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-500 text-sm text-center max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

type EmptyProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
