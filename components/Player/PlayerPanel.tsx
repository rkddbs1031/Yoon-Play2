import { useEffect, useState } from 'react';

import { usePlayer } from '@/hooks/usePlayer';

const ANIMATION_DURATION = 300;
const OPEN_PANEL_TRANSFORM = 'translate-y-0';
const CLOSED_PANEL_TRANSFROM = 'translate-y-full';

const PlayerPanel = () => {
  const { isPlaylistPanelOpen, playlist, currentVideo } = usePlayer();
  const [shouldRender, setShouldRender] = useState(isPlaylistPanelOpen);
  const [animation, setAnimation] = useState(isPlaylistPanelOpen ? OPEN_PANEL_TRANSFORM : CLOSED_PANEL_TRANSFROM);

  useEffect(() => {
    if (isPlaylistPanelOpen) {
      setShouldRender(true);
      setTimeout(() => setAnimation(OPEN_PANEL_TRANSFORM), 10);
    } else {
      setAnimation(CLOSED_PANEL_TRANSFROM);
      const timer = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isPlaylistPanelOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full h-[calc(100vh-77px)] bg-white transition-all duration-${ANIMATION_DURATION} ${animation}`}
    >
      PlayerPanel
    </div>
  );
};
export default PlayerPanel;
