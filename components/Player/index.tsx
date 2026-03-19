'use client';

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
  return <Player />;
};

export default PlayerWrapper;
