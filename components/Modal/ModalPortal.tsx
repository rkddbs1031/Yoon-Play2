import { ReactNode } from 'react';

import Portal from '../Portal';

interface ModalPortalProps {
  label: string;
  children: ReactNode;
}

export default function ModalPortal({ label, children }: ModalPortalProps) {
  return (
    <Portal>
      <div id={`${label}-layer`} className='fixed inset-0 z-[1000]' aria-modal='true' role='dialog'>
        {children}
      </div>
    </Portal>
  );
}
