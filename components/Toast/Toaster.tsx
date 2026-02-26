import { useToast } from '@/hooks/useToast';

import Toast from './Toast';

export function Toaster() {
  const { currentToast } = useToast();

  if (!currentToast) return null;

  return <Toast toast={currentToast} />;
}
