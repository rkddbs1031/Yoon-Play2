import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import { useLike } from '@/hooks/useLike';
import { usePlayerCore } from '@/hooks/usePlayer';
import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';
import { currentVideoAtom } from '@/store/playerAtom';
import { formatThumbnailUrl } from '@/utils/thumbnail';
import { QueueContext } from '@/types/queue';

import { PlayerPanelHeader } from './PlayerPanelHeader';
import { PlayerQueueItem } from '../PlayerQueueItem';

const ANIMATION_DURATION = 400;

const PlayerPanel = () => {
  const { isPlaylistPanelOpen, playlist, togglePlaylistPanel, setCurrentVideoId } = usePlayerCore();
  const currentVideo = useAtomValue(currentVideoAtom);

  const { shouldRender, animation } = useAnimatedMount(isPlaylistPanelOpen, {
    open_transform: 'translate-y-0',
    closed_transform: 'translate-y-full',
    duration: ANIMATION_DURATION,
  });
  const backgroundImage = formatThumbnailUrl({ thumbnail: currentVideo?.thumbnail, size: 'small' });

  const { displayImage: overlayBG } = usePlayerBackground(backgroundImage);
  const [queueHeight, setQueueHeight] = useState<string>('auto');
  const [topHeight, setTopHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleMore = () => setIsDropdownOpen(prev => !prev);
  const handleCloseDropdown = () => setIsDropdownOpen(false);

  const { isLiked, toggleLike } = useLike();
  const isLikedCurrent = currentVideo ? isLiked(currentVideo.videoId) : false;

  const handleToggleLike = () => {
    if (!currentVideo) return;
    const result = toggleLike(currentVideo); // add | remove
    console.log(`TODO:${result}`);
  };

  const handleAddToPlaylist = () => console.log('handleAddToPlaylist');

  useEffect(() => {
    document.body.style.overflow = isPlaylistPanelOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlaylistPanelOpen]);

  const handleResize = useCallback(() => {
    if (topRef.current && containerRef.current) {
      const topHeight = topRef.current.offsetHeight;
      const containerStyle = window.getComputedStyle(containerRef.current);
      const paddingTop = parseFloat(containerStyle.paddingTop);
      const paddingBottom = parseFloat(containerStyle.paddingBottom);

      setTopHeight(topHeight);
      setQueueHeight(`calc(100vh - ${topHeight + paddingTop + paddingBottom}px)`);
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    // 애니메이션 완료 후 높이 계산
    const timer = setTimeout(() => {
      handleResize();
    }, ANIMATION_DURATION);

    const resizeHandler = () => requestAnimationFrame(handleResize);
    window.addEventListener('resize', resizeHandler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [handleResize, shouldRender]);

  if (!shouldRender || !currentVideo) return null;

  return (
    <section
      className={`player-panel fixed z-[999] top-0 left-0 w-full h-full transition-all duration-${ANIMATION_DURATION} ${animation} ease-in-out bg-[linear-gradient(to_bottom,black,white)] backdrop-blur-[0px]`}
    >
      {overlayBG && (
        <div className={`background-image absolute w-full`} style={{ height: topHeight - 30 }}>
          <div
            className={`background-thumbnail h-full transition-opacity duration-${TRANSITION_DURATION} ease-in-out bg-cover bg-center bg-no-repeat blur-[30px] `}
            style={{ backgroundImage: `url(${overlayBG})` }}
          />
        </div>
      )}
      <div className='overlay absolute bottom-0 left-0 transition-all duration-500 bg-[linear-gradient(to_bottom,transparent_20%,rgb(0_0_0_/_40%)_100%)]  backdrop-blur-[30px] w-full h-full'></div>

      <div
        ref={containerRef}
        className='player-panel-container relative z-10 w-full max-w-[750px] mx-auto px-5 py-4 md:py-6 md:px-[24px]'
      >
        <PlayerPanelHeader
          ref={topRef}
          currentVideo={currentVideo}
          isLiked={isLikedCurrent}
          isDropdownOpen={isDropdownOpen}
          onTogglePanel={togglePlaylistPanel}
          onToggleMore={handleToggleMore}
          onCloseDropdown={handleCloseDropdown}
          onToggleLike={handleToggleLike}
          onAddToPlaylist={handleAddToPlaylist}
        />

        <div className='player-queue overflow-y-auto' style={{ height: queueHeight }}>
          <ul>
            {playlist.map((item, idx) => (
              <li
                key={`${item.videoId}-${idx}`}
                className='relative border-t border-white/15 last:border-b last:border-white/20'
              >
                <PlayerQueueItem
                  item={item}
                  isActive={item.videoId === currentVideo.videoId}
                  onClick={() => setCurrentVideoId(item.videoId)}
                  context={QueueContext.CurrentQueue}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PlayerPanel;
