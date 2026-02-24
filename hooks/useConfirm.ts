import { useAtom } from 'jotai';

import { confirmAtom } from '@/store/ui/modalAtom';
import { ConfirmState } from '@/types/confirm';

export const useConfirm = () => {
  const [confirm, setConfirm] = useAtom(confirmAtom);

  const openConfirm = (options: Omit<ConfirmState, 'isOpen'>) => {
    setConfirm({
      isOpen: true,
      ...options,
    });
  };

  const closeConfirm = () => {
    setConfirm(prev => ({ ...prev, isOpen: false }));
  };

  return {
    isOpen: confirm.isOpen,
    title: confirm.title,
    message: confirm.message,
    confirmText: confirm.confirmText,
    cancelText: confirm.cancelText,
    isDanger: confirm.isDanger,
    onConfirm: confirm.onConfirm,

    openConfirm,
    closeConfirm,
  };
};
