import { useEffect, useState } from 'react';

import type { Toast as ToastType } from '@/types/toast';

const toastTypeBgMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-orange-500',
  info: 'bg-blue-500',
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
    <div id='toast' className='fixed top-4 right-4 z-[2000] w-full max-w-[20rem]'>
      <div
        className={`
          transition-transform duration-500 ease-in-out 
          ${isVisible ? 'translate-x-0 translate-y-0' : 'translate-x-[110%]'} 
          ${toastTypeBgMap[toast.type]} text-white rounded-sm `}
      >
        <div className='flex flex-row items-center justify-between gap-5 pl-4 pr-3 py-2'>
          <div className='flex flex-col items-start gap-1'>
            <span className='text-base'>{toast.title}</span>
            {toast.subtitle && <span className='text-sm'>{toast.subtitle}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
