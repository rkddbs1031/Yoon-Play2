import { useConfirm } from '@/hooks/useConfirm';

import {
  ModalPortal as ConfirmPortal,
  ModalOverlay as ConfirmOverlay,
  ModalContent as ConfirmContent,
} from '@/components/Modal';

export default function Confrim() {
  const { isOpen, title, message, confirmText, cancelText, isDanger, onConfirm, closeConfirm } = useConfirm();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (onConfirm) await onConfirm();

    closeConfirm();
  };

  return (
    <ConfirmPortal label='confirm'>
      <ConfirmOverlay onClose={closeConfirm} />

      <ConfirmContent zIndex={1200} className='mx-4 max-w-[320px]'>
        <div className='p-4 border-b border-[#66666610]'>
          <h2 className='font-[500]'>{title}</h2>
        </div>

        <div className='p-4 pt-5'>
          <p className='text-sm text-[#52527a] whitespace-pre-wrap mb-4'>{message}</p>
        </div>

        <div className='p-4 flex justify-end gap-2'>
          <button
            type='button'
            onClick={closeConfirm}
            className='text-xs rounded-full px-4 py-2 hover:bg-white/40 duration-200'
          >
            {cancelText || '취소'}
          </button>

          <button
            type='button'
            onClick={handleConfirm}
            className={`text-xs ${isDanger ? 'bg-[#e44545]' : 'bg-[currentColor]/90'} rounded-full px-4 py-2`}
          >
            <span className='text-white'>{confirmText || '확인'}</span>
          </button>
        </div>
      </ConfirmContent>
    </ConfirmPortal>
  );
}
