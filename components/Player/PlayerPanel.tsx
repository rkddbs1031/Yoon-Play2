import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';

import { useLike } from '@/hooks/useLike';
import { usePlayerCore } from '@/hooks/usePlayer';
import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { usePlayerBackground } from '@/hooks/usePlayerBackground';
import { currentVideoAtom } from '@/store/playerAtom';
import { formatThumbnailUrl } from '@/utils/thumbnail';
import { QueueContext } from '@/types/queue';

import { PlayerPanelHeader } from './PlayerPanelHeader';
import { PlayerPanelBackground } from './PlayerPanelBackground';
import { PlayerQueueItem } from '../PlayerQueueItem';
import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistAddModal } from '@/hooks/useModal';
import { PlaylistItem } from '@/types/playlist';

const ANIMATION_DURATION = 400;

const PlayerPanel = () => {
  const { currentVideo, isPlaylistPanelOpen, playlist, togglePlaylistPanel, setCurrentVideoId } = usePlayerCore();

  const { shouldRender, animation } = useAnimatedMount(isPlaylistPanelOpen, {
    open_transform: 'translate-y-0',
    closed_transform: 'translate-y-full',
    duration: ANIMATION_DURATION,
  });
  const backgroundImage = formatThumbnailUrl({ thumbnail: currentVideo?.thumbnail, size: 'small' });
  const { displayImage: overlayBG } = usePlayerBackground(backgroundImage);

  const { setPlaylistTargetTrack } = usePlaylist();
  const { openModal } = usePlaylistAddModal();
  const { isLiked, toggleLike } = useLike();

  const [queueHeight, setQueueHeight] = useState<string>('auto');
  const [topHeight, setTopHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLikedCurrent = currentVideo ? isLiked(currentVideo.videoId) : false;

  const handleToggleMore = () => setIsDropdownOpen(prev => !prev);

  const handleToggleLike = () => {
    if (!currentVideo) return;
    toggleLike(currentVideo); // add | remove
  };

  const handleAddToPlaylist = () => {
    if (!currentVideo) return;
    handleToggleMore();

    setPlaylistTargetTrack(currentVideo);
    openModal();
  };

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
      <PlayerPanelBackground overlayImage={overlayBG} height={topHeight - 30} />

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
          onCloseDropdown={handleToggleMore}
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
