import { useAtomValue, useSetAtom } from 'jotai';
import { addToastAtom, clearQueueAtom, currentToastAtom, removeToastAtom } from '@/store/ui/toastAtom';

const DEFAULT_DURATION = {
  success: 3000,
  warning: 3000,
  info: 3000,
  error: 4000,
} as const;

interface ToastShorthandOptions {
  subtitle?: string;
  duration?: number;
}

export function useToast() {
  const addToast = useSetAtom(addToastAtom);
  const removeToast = useSetAtom(removeToastAtom);
  const clearQueue = useSetAtom(clearQueueAtom);
  const currentToast = useAtomValue(currentToastAtom);

  const createToastMethod = (type: keyof typeof DEFAULT_DURATION) => {
    return (title: string, { subtitle = '', duration }: ToastShorthandOptions = {}) => {
      addToast({ title, subtitle, type, duration: duration ?? DEFAULT_DURATION[type] });
    };
  };

  const toast = {
    currentToast,

    success: createToastMethod('success'),
    warning: createToastMethod('warning'),
    error: createToastMethod('error'),
    info: createToastMethod('info'),

    remove: (id: string) => removeToast(id),
    clear: () => clearQueue(),
  };

  return toast;
}
