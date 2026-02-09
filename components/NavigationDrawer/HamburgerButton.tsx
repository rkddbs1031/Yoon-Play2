'use client';

import { useAtom } from 'jotai';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { HamburgerIcon } from '@/states/icon/svgs';
import { isSidebarOpenAtom } from '@/store/ui/sidebarAtom';

export default function HamburgerButton() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [_, setIsOpen] = useAtom(isSidebarOpenAtom);

  if (!isMobile) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`${isMobile ? 'opacity-100 visible' : 'opacity-0 invisible'} duration-400 fixed top-4 left-4 z-[555] p-2 hover:bg-white/30 backdrop-blur-md rounded-full shadow cursor-pointer`}
    >
      <HamburgerIcon size={16} />
    </button>
  );
}
