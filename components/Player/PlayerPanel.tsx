import { useCallback, useEffect, useRef, useState } from 'react';

import { usePlayer } from '@/hooks/usePlayer';
import { useAnimatedMount } from '@/hooks/useAnimatedMount';
import { TRANSITION_DURATION, usePlayerBackground } from '@/hooks/usePlayerBackground';
import { DownIcon, MoreVerticalIcon } from '@/states/icon/svgs';

import { MusicInfoWrapper } from './MusicInfo';
import { PlayerControl } from './PlayerControl';

const ANIMATION_DURATION = 400;

const PlayerPanel = () => {
  const { isPlaylistPanelOpen, playlist, currentVideo, togglePlaylistPanel, setCurrentIndex } = usePlayer();
  const { shouldRender, animation } = useAnimatedMount(isPlaylistPanelOpen, {
    open_transform: 'translate-y-0',
    closed_transform: 'translate-y-full',
    duration: ANIMATION_DURATION,
  });
  const { displayImage } = usePlayerBackground(currentVideo?.thumbnail?.medium?.url);

  const [queueHeight, setQueueHeight] = useState<string>('auto');
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaylistPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

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
      className={`player-panel fixed top-0 left-0 w-full h-full transition-all duration-${ANIMATION_DURATION} ${animation} ease-in-out bg-[linear-gradient(to_bottom,black,white)] backdrop-blur-[0px]`}
    >
      {displayImage && (
        <div className={`background-image absolute h-full w-full`}>
          <div
            className={`background-thumbnail h-[50vh] transition-opacity duration-${TRANSITION_DURATION} ease-in-out bg-cover bg-center bg-no-repeat blur-[30px] `}
            style={{ backgroundImage: `url(${displayImage})` }}
          />
        </div>
      )}
      <div className='overlay background-gradient absolute top-0 left-0 transition-all duration-500 bg-[linear-gradient(to_bottom,transparent_80%,rgb(0_0_0_/_30%)_100%)]  backdrop-blur-[30px] w-full h-full'></div>

      <div
        ref={containerRef}
        className='player-panel-container relative z-10 w-full max-w-[750px] mx-auto p-5 md:py-[32px] md:px-[24px]'
      >
        <div ref={topRef} className='player-top'>
          <div className='top-button flex justify-between w-full'>
            <button type='button' onClick={togglePlaylistPanel} className='down-btn cursor-pointer'>
              <DownIcon color='white' size={20} />
            </button>
            <button type='button' className='more-btn cursor-pointer'>
              <MoreVerticalIcon color='white' size={20} />
            </button>
          </div>

          <div className='thumbnail py-6 sm:py-7 max-w-[360px] w-full mx-auto'>
            <img
              src={currentVideo.thumbnail.medium.url}
              alt={currentVideo.title}
              className='block w-full rounded-[8px]'
            />
          </div>

          <div className='player-controls flex flex-col gap-5'>
            <div className='music-info flex flex-col gap-[2px]'>
              <h3 className={`text-[14px] text-white font-[600]`}>{currentVideo.title}</h3>
              <span className={`text-[10px] text-white/60 `}>{currentVideo.channelTitle}</span>
            </div>
            <PlayerControl.ProgressBar />
            <div className='player-control-buttons mb-6'>
              <PlayerControl.Buttons color='#ffffff' disabledColor={currentVideo && '#ffffff66'} size={28} />
            </div>
          </div>
        </div>

        <div className='player-queue overflow-y-auto' style={{ height: queueHeight }}>
          <ul>
            {playlist.map(({ videoId, thumbnail, title, channelTitle }, idx) => (
              <li
                key={`${videoId}-${idx}`}
                className={`pt-[10px] pb-[6px] border-t border-white/15 last:border-b last:border-white/20 ${videoId === currentVideo.videoId ? 'is-active bg-[linear-gradient(180deg,rgb(255_255_255_/_25%)_0%,rgb(255_255_255_/_10%)_50%,rgb(255_255_255_/_25%)_100%)]' : ''}`}
              >
                <button type='button' className='w-full cursor-pointer px-2' onClick={() => setCurrentIndex(idx)}>
                  <MusicInfoWrapper
                    thumbnail={thumbnail.medium.url}
                    title={title}
                    channelTitle={channelTitle}
                    imageSize={36}
                    color={{ title: 'text-white', channelTitle: 'text-white/70' }}
                    fontSize={{ title: 'text-[12px]', channelTitle: 'text-[10px]' }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default PlayerPanel;
