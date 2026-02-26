export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  subtitle?: string;
  type: ToastType;
  duration: number;
}

export interface ToastOptions {
  title: string;
  subtitle: string;
  duration: number;
  type: ToastType;
}
