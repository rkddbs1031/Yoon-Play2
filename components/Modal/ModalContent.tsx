import { CSSProperties, ReactNode } from 'react';

/**모달박스 UI, z-index 계층, click 전파, 크기/정렬옵션 */
interface ModalContentProps {
  children: ReactNode;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
}

export default function ModalContent({
  children,
  zIndex = 1000,
  className = '',
  style,
  width = 420,
}: ModalContentProps) {
  return (
    <div
      id='modal-content'
      className='fixed inset-0 flex items-center justify-center'
      style={{ zIndex }}
      onClick={e => e.stopPropagation()}
    >
      <div
        className={`bg-[#F4F2FB]/90 backdrop-blur-md rounded-[5px] shadow-[0_8px_24px_rgba(46,51,79,0.12)]
      overflow-y-auto max-h-[80vh] w-full ${className}`}
        style={{ width, ...style }}
      >
        {children}
      </div>
    </div>
  );
}
