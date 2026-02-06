interface ModalOverlayProps {
  onClose?: () => void;
  zIndex?: number;
}

//TODO
export default function ModalOverlay({ onClose, zIndex = 1000 }: ModalOverlayProps) {
  return <div className='fixed inset-0 bg-black/40' style={{ zIndex }} onClick={onClose} aria-hidden />;
}
