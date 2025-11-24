'use client';

import { usePathname } from 'next/navigation';

import { PlayerBar } from './PlayerBar';
import PlayerPanel from './PlayerPanel';

const Player = () => {
  return (
    <>
      <PlayerBar />
      <PlayerPanel />
    </>
  );
};

const PlayerWrapper = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return !isHome ? <Player /> : null;
};

export default PlayerWrapper;
