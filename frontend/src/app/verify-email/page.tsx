import React, { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';
import { PageLoader } from '@/components/ui/PageStates';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading..." />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
