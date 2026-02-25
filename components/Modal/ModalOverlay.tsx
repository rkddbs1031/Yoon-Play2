interface ModalOverlayProps {
  onClose?: () => void;
  zIndex?: number;
}

export default function ModalOverlay({ onClose, zIndex = 1000 }: ModalOverlayProps) {
  return (
    <div
      id='modal-overlay'
      className='fixed inset-0 bg-black/30 backdrop-blur-xs'
      style={{ zIndex }}
      onClick={onClose}
      aria-hidden
    />
  );
}
