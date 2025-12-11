import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAtomValue } from 'jotai';

import { useLike } from '@/hooks/useLike';
import { usePlayerCore } from '@/hooks/usePlayer';
import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';
import { DownIcon, LikeIcon, MoreVerticalIcon } from '@/states/icon/svgs';
import { currentVideoAtom } from '@/store/playerAtom';
import { formatThumbnailUrl } from '@/utils/thumbnail';

import { PlayerControl } from './PlayerControl';
import { PlayerQueueItem } from './PlayerQueueItem';
import PlayerDropdown from './PlayerDropdown';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMoreBtn = () => setIsDropdownOpen(prev => !prev);
  const handleCloseDropdown = () => setIsDropdownOpen(false);

  const { isLiked, toggleLike } = useLike();
  const isLikedCurrent = currentVideo ? isLiked(currentVideo.videoId) : false;

  const handleToggleLike = () => {
    if (!currentVideo) return;
    const result = toggleLike(currentVideo); // add | remove
    console.log(`TODO:${result}`);
  };

  const handleAddToPlaylist = () => {
    console.log('handleAddToPlaylist');
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
        <div className={`background-image absolute h-full w-full`}>
          <div
            className={`background-thumbnail h-[50vh] transition-opacity duration-${TRANSITION_DURATION} ease-in-out bg-cover bg-center bg-no-repeat blur-[30px] `}
            style={{ backgroundImage: `url(${overlayBG})` }}
          />
        </div>
      )}
      <div className='overlay background-gradient absolute top-0 left-0 transition-all duration-500 bg-[linear-gradient(to_bottom,transparent_80%,rgb(0_0_0_/_30%)_100%)]  backdrop-blur-[30px] w-full h-full'></div>

      <div
        ref={containerRef}
        className='player-panel-container relative z-10 w-full max-w-[750px] mx-auto px-5 py-4 md:py-6 md:px-[24px]'
      >
        <div ref={topRef} className='player-top'>
          <div className='top-button flex justify-between w-full'>
            <button type='button' onClick={togglePlaylistPanel} className='down-btn cursor-pointer'>
              <DownIcon color='white' size={20} />
            </button>
            <button type='button' className='more-btn cursor-pointer' onClick={toggleMoreBtn}>
              <MoreVerticalIcon color='white' size={20} />
            </button>
            <PlayerDropdown
              isOpen={isDropdownOpen}
              isLiked={isLikedCurrent}
              onAddToPlaylist={handleAddToPlaylist}
              onToggleLike={handleToggleLike}
              onClose={handleCloseDropdown}
            />
          </div>

          <div className='thumbnail py-5 px-8 sm:py-7 max-w-[360px] w-full mx-auto'>
            <div className='relative w-full aspect-[16/9] overflow-hidden rounded-[8px]'>
              <Image
                src={formatThumbnailUrl({ thumbnail: currentVideo.thumbnail, size: 'large' })}
                alt={currentVideo.title}
                fill
                className='object-cover rounded-[8px]'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 360px'
                quality={80}
                priority
              />
            </div>
          </div>

          <div className='player-controls flex flex-col gap-5'>
            <div className='music-info flex gap-2 justify-between items-center'>
              <div className='music-player-and-title flex flex-col gap-1'>
                <h3 className={`text-[14px] text-white font-[600]`}>{currentVideo.title}</h3>
                <span className={`text-[10px] text-white/60 `}>{currentVideo.channelTitle}</span>
              </div>
              <div className='like'>
                <button type='button' onClick={handleToggleLike} className='cursor-pointer'>
                  <LikeIcon fill={isLikedCurrent ? '#12b886' : 'none'} size={20} color='#12b886' />
                </button>
              </div>
            </div>
            <PlayerControl.ProgressBar />
            <div className='player-control-buttons mb-6'>
              <PlayerControl.Buttons color='#ffffff' disabledColor={currentVideo && '#ffffff66'} size={28} />
            </div>
          </div>
        </div>

        <div className='player-queue overflow-y-auto' style={{ height: queueHeight }}>
          <ul>
            {playlist.map(item => (
              <PlayerQueueItem
                key={item.videoId}
                item={item}
                isActive={item.videoId === currentVideo.videoId}
                onClick={() => setCurrentVideoId(item.videoId)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PlayerPanel;
