'use client';

import { memo, JSX, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';

import { YoonLogoIcon, HomeIcon, ExploreIcon, Libraryicon, CloseIcon } from '@/states/icon/svgs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { isSidebarOpenAtom } from '@/store/sidebarAtom';

interface NavMenu {
  href: string;
  label: string;
  icon: (active: boolean) => JSX.Element;
}

const navMenu: NavMenu[] = [
  {
    href: '/',
    label: '홈',
    icon: active => <HomeIcon color={active ? '#52527a' : '#9b9bb5'} size={16} />,
  },
  {
    href: '/explore',
    label: '탐색',
    icon: active => <ExploreIcon color={active ? '#52527a' : '#9b9bb5'} size={20} />,
  },
  {
    href: '/library',
    label: '보관함',
    icon: active => <Libraryicon color={active ? '#52527a' : '#9b9bb5'} size={16} />,
  },
];

const LNB = memo(() => {
  return (
    <nav className='mt-12'>
      <ul className='flex flex-col gap-8'>
        {navMenu.map((menu, idx) => (
          <li key={`${menu.label}-${idx}`}>
            <NavLink href={menu.href} label={menu.label} icon={menu.icon} />
          </li>
        ))}
      </ul>
    </nav>
  );
});

LNB.displayName = 'LNB';

interface NavLinkProps {
  href: string;
  label: string;
  icon: JSX.Element | ((active: boolean) => JSX.Element);
}

const NavLink = memo(({ href, label, icon }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));

  const renderedIcon = typeof icon === 'function' ? icon(isActive) : icon;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-[6px] transition-all ${
        isActive ? 'text-[#52527a] font-semibold' : 'text-[#9b9bb5]'
      }`}
    >
      <span
        className={`flex items-center justify-center w-[30px] h-[30px] rounded-full transition-all ${
          isActive ? 'bg-white/80 shadow' : 'bg-white/35'
        }`}
      >
        {renderedIcon}
      </span>
      <span className='text-xs'>{label}</span>
    </Link>
  );
});

NavLink.displayName = 'NavLink';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useAtom(isSidebarOpenAtom);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const sidebarLeft = isMobile ? (isOpen ? 'left-0' : '-left-[100%]') : 'left-0';
  const sidebarBg = isMobile ? 'bg-white/55' : 'bg-white/35';

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
      return;
    }

    setIsOpen(false);
  }, [isMobile]);

  return (
    <aside
      className={`fixed z-[777] w-[130px] top-0 ${sidebarLeft} transition-all duration-500 ease-in-out h-full ${sidebarBg} backdrop-blur-[15px] pt-10 flex flex-col items-center gap-5 text-center`}
    >
      <h2 className='flex flex-col items-center gap-1'>
        <div className='bg-white/70 w-8 h-8 rounded-full flex items-center justify-center'>
          <YoonLogoIcon color='#52527a' />
        </div>
        <span className='text-[12px] font-[600]'>Yoon-Play2</span>
      </h2>
      <LNB />

      {isMobile && (
        <div className='close-button absolute top-[10px] right-[10px]'>
          <button
            type='button'
            className='flex justify-center items-center w-6 h-6 hover:bg-white/30 duration-300 rounded-full cursor-pointer'
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon size={12} />
          </button>
        </div>
      )}
    </aside>
  );
}
