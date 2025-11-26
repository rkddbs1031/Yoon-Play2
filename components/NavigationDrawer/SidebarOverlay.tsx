'use client';

import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store/sidebarAtom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function SidebarOverlay() {
  const [isOpen, setIsOpen] = useAtom(isSidebarOpenAtom);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isMobile) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-[3px] transition-opacity duration-300 z-[666]
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsOpen(false)}
    />
  );
}
