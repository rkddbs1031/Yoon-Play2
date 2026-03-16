import { useEffect, useState } from 'react';

import { ToastSuccuessIcon, ToastErrorIcon, ToastWarningIcon, ToastInfoIcon } from '@/states/icon/svgs';

import type { Toast as ToastType } from '@/types/toast';

const toastIconMap: Record<ToastType['type'], React.ReactNode> = {
  success: <ToastSuccuessIcon size={20} color='#509f93' />,
  error: <ToastErrorIcon size={16} color='#B55E5E' />,
  warning: <ToastWarningIcon size={20} color='#B5893A' />,
  info: <ToastInfoIcon size={22} color='#5A6FA8' />,
};

const toastStyleMap = {
  success: { gradient: 'from-[#70aaa1]/75' },
  error: { gradient: 'from-[#C97B7B]/75' },
  warning: { gradient: 'from-[#C9A96E]/75' },
  info: { gradient: 'from-[#7B8FC9]/75' },
};

interface ToastProps {
  toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
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
          relative transition-transform duration-500 ease-in-out
          ${isVisible ? 'translate-x-0' : 'translate-x-[110%]'}
          bg-gradient-to-r ${toastStyleMap[toast.type].gradient} via-white/75 via-10% to-white/90
          shadow-lg rounded-xl w-fit min-w-[220px] max-w-[320px]`}
      >
        <div className='flex items-start gap-3 px-4 py-3'>
          {toastIconMap[toast.type] && (
            <div className='flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/60'>
              {toastIconMap[toast.type]}
            </div>
          )}
          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-[#3d3d68] break-words'>{toast.title}</span>
            {toast.subtitle && <span className='text-xs text-[#3d3d68]/60 break-words mt-[2px]'>{toast.subtitle}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

Toast.displayName = 'Toast';
