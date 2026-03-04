import { useEffect, useState } from 'react';

import type { Toast as ToastType } from '@/types/toast';

const toastAccentColorMap = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
};

interface ToastProps {
  toast: ToastType;
}

export default function Toast({ toast }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(false);

    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    const exitTimer = setTimeout(
      () => {
        setIsVisible(false);
      },
      (toast.duration || 3000) - 300,
    );

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [toast.id, toast.duration]);

  return (
    <div id='toast' className='fixed top-6 right-4 z-[2000] flex flex-col items-end pointer-events-none'>
      <div
        className={`
          relative overflow-hidden transition-transform duration-500 ease-in-out 
          ${isVisible ? 'translate-x-0 translate-y-0' : 'translate-x-[110%]'} 
          shadow-xl bg-white/80 backdrop-blur-sm rounded-md w-fit min-w-[200px] max-w-[320px]`}
      >
        <div className='flex flex-col items-start gap-1 pl-4 pr-2 py-2'>
          <span className={`text-sm md:text-base font-semibold whitespace-nowrap`}>{toast.title}</span>
          {toast.subtitle && (
            <span className={`text-xs md:text-sm text-[currentColor]/80 break-all`}>{toast.subtitle}</span>
          )}
        </div>

        <div className={`absolute left-0 top-0 h-full w-[4px] ${toastAccentColorMap[toast.type]}`} />
      </div>
    </div>
  );
}
