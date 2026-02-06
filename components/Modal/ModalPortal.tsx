import { ReactNode } from 'react';
import Portal from '../Portal';

interface ModalPortalProps {
  children: ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
  return (
    <Portal>
      <div id='modal-layer' className='fixed inset-0 z-[1000]' aria-modal='true' role='dialog'>
        {children}
      </div>
    </Portal>
  );
}
