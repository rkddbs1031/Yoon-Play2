'use client';

import { useEffect } from 'react';
import { validateAndRepairDB } from '@/lib/indexedDB';

export function DBProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    validateAndRepairDB();
  }, []);

  return <>{children}</>;
}
