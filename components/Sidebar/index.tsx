'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';

import { YoonLogoIcon, HomeIcon, ExploreIcon, Libraryicon } from '@/states/icon/svgs';

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

const LNB = () => {
  const pathname = usePathname();

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
};

interface NavLinkProps {
  href: string;
  label: string;
  icon: JSX.Element | ((active: boolean) => JSX.Element);
}

const NavLink = ({ href, label, icon }: NavLinkProps) => {
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
};

function Sidebar() {
  return (
    <aside className='fixed w-[130px] h-full bg-white/40 backdrop-blur-[10px] pt-10 flex flex-col items-center gap-5 text-center'>
      <h2 className='flex flex-col items-center gap-1'>
        <div className='bg-white/70 w-8 h-8 rounded-full flex items-center justify-center'>
          <YoonLogoIcon color='#52527a' />
        </div>
        <span className='text-[12px] font-[600]'>Yoon-Play2</span>
      </h2>
      <LNB />
    </aside>
  );
}

export default Sidebar;
