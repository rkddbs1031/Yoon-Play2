import { atom } from 'jotai';

import type { Toast, ToastOptions } from '@/types/toast';

export const DEFAULT_TOAST_DURATION = 3000;

export const toastQueueAtom = atom<Toast[]>([]);
export const currentToastAtom = atom<Toast | null>(null);
export const toastTimerAtom = atom<ReturnType<typeof setTimeout> | null>(null);

const processQueue = (get: Function, set: Function) => {
  const currentToast = get(currentToastAtom);
  const queue = get(toastQueueAtom);
  const timerId = get(toastTimerAtom);

  if (currentToast) return;
  if (queue.length === 0) {
    set(currentToastAtom, null);
    return;
  }

  const [nextToast, ...rest] = queue;

  if (timerId) clearTimeout(timerId);

  set(currentToastAtom, nextToast);
  set(toastQueueAtom, rest);

  const timeoutId = setTimeout(() => {
    set(currentToastAtom, null);

    const animationDelay = setTimeout(() => {
      processQueue(get, set);
    }, 300);

    set(toastTimerAtom, animationDelay);
  }, nextToast.duration);

  set(toastTimerAtom, timeoutId);
};

export const addToastAtom = atom(null, (get, set, options: ToastOptions) => {
  const newToast: Toast = {
    ...options,
    id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    duration: options.duration || DEFAULT_TOAST_DURATION,
  };

  set(toastQueueAtom, prev => [...prev, newToast]);

  if (!get(currentToastAtom)) {
    processQueue(get, set);
  }
});

export const removeToastAtom = atom(null, (get, set, id: string) => {
  const timerId = get(toastTimerAtom);
  if (timerId) clearTimeout(timerId);

  const currentToast = get(currentToastAtom);
  const isRemovingCurrent = currentToast?.id === id;

  set(toastQueueAtom, (prev: Toast[]) => prev.filter(t => t.id !== id));
  set(toastTimerAtom, null);

  if (isRemovingCurrent) {
    set(currentToastAtom, null);
    setTimeout(() => processQueue(get, set), 300);
  }
});

export const clearQueueAtom = atom(null, (get, set) => {
  const timerId = get(toastTimerAtom);
  if (timerId) clearTimeout(timerId);

  set(toastQueueAtom, []);
  set(currentToastAtom, null);
  set(toastTimerAtom, null);
});

export const processQueueAtom = atom(null, (get, set) => {
  processQueue(get, set);
});
