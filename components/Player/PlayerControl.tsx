import { ChangeEvent, useEffect, useRef, useState, PointerEvent, MouseEvent, useCallback, memo, useMemo } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useAtom, useAtomValue } from 'jotai';

import { ACTIVE_COLOR, DISABLED_COLOR } from '@/constants/colors';
import { usePlayer } from '@/hooks/usePlayer';
import { MutedVolumeIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from '@/states/icon/svgs';
import { isHoveredVolumeButton } from '@/store/playerAtom';

const PlayerFrame = () => {
  const {
    currentVideo,
    isPlaying,
    setIsPlaying,
    setPlayerRef,
    playerRef,
    setDuration,
    setCurrentTime,
    volume,
    lastIndex,
    currentIndex,
    setCurrentIndex,
    isActuallyPlayerReady,
    setIsPlayerReady,
  } = usePlayer();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const localPlayerRef = useRef<YouTubePlayer | null>(null);

  const handleReady = (e: YouTubeEvent) => {
    // console.log('handleReady! YouTube Player fully loaded.');
    localPlayerRef.current = e.target;
    setPlayerRef(e.target);
    setIsPlayerReady(true); // 플레이어가 완전히 준비되었음을 전역 상태에 알림!

    const duration = e.target.getDuration();
    setDuration(duration);
    setCurrentTime(0);
  };

  const handleEnd = () => {
    if (currentIndex < lastIndex) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === lastIndex) {
      setIsPlaying(false);
    }
  };

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (localPlayerRef.current) {
        const time = localPlayerRef.current.getCurrentTime();
        setCurrentTime(time);
      }
    }, 300);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleStateChange = (e: YouTubeEvent) => {
    if (!isActuallyPlayerReady) return;

    // 0 = 종료, 1 = 재생중, 2 = 일시 정지, 3 = 버퍼링 5 = 동영상 준비
    if (e.data === 1) {
      startInterval();
    } else if (e.data === 0 || e.data === 2) {
      stopInterval();
    }
  };

  const handlePlayVideo = useCallback(() => {
    if (!isActuallyPlayerReady) return;

    try {
      if (isPlaying) {
        playerRef.playVideo();
      } else {
        playerRef.pauseVideo();
      }
    } catch (error) {
      // console.log('YouTube 플레이어 조작 중 오류 발생:', error);
    }
  }, [isPlaying, playerRef, isActuallyPlayerReady]);

  useEffect(() => {
    if (!isActuallyPlayerReady) return;

    const timeoutId = setTimeout(() => handlePlayVideo(), 300);

    return () => clearTimeout(timeoutId);
  }, [isPlaying, isActuallyPlayerReady, handlePlayVideo]);

  useEffect(() => {
    if (isActuallyPlayerReady) {
      try {
        playerRef.setVolume(volume);
      } catch (error) {
        // console.error('Failed to set volume:', error);
      }
    }
  }, [volume, isActuallyPlayerReady]);

  useEffect(() => {
    return () => {
      stopInterval();
      setPlayerRef(null);
      setIsPlayerReady(false);
    };
  }, []);

  if (!currentVideo) return null;

  return (
    <YouTube
      key={currentVideo.videoId}
      className='hidden'
      videoId={currentVideo.videoId}
      onReady={handleReady}
      onEnd={handleEnd}
      onStateChange={handleStateChange}
      opts={{
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
      }}
    />
  );
};

const PlayerButtons = memo(() => {
  const isHovered = useAtomValue(isHoveredVolumeButton);
  const { isPlaying, currentIndex, lastIndex, isActuallyPlayerReady, prevPlay, nextPlay, togglePlay } = usePlayer();

  const isPrevButtonDisabled = !isActuallyPlayerReady || currentIndex === 0;
  const prevIconColor = isPrevButtonDisabled ? DISABLED_COLOR : ACTIVE_COLOR;
  const prevCursor = isPrevButtonDisabled ? 'cursor-default' : 'cursor-pointer';

  const isToggleButtonDisabled = !isActuallyPlayerReady;
  const toggleIconColor = isToggleButtonDisabled ? DISABLED_COLOR : ACTIVE_COLOR; // 토글 버튼 아이콘 색상
  const toggleCursor = isToggleButtonDisabled ? 'cursor-default' : 'cursor-pointer';

  const isNextButtonDisabled = !isActuallyPlayerReady || currentIndex === lastIndex;
  const nextIconColor = isNextButtonDisabled ? DISABLED_COLOR : ACTIVE_COLOR;
  const nextCursor = isNextButtonDisabled ? 'cursor-default' : 'cursor-pointer';

  return (
    <div
      className={`${isHovered ? 'opacity-0' : 'opacity-100'} transition-all button-wrapper flex flex-row gap-2 items-center`}
    >
      <button type='button' onClick={prevPlay} disabled={isPrevButtonDisabled} className={prevCursor}>
        <PrevIcon size={18} color={prevIconColor} />
      </button>
      <button type='button' onClick={togglePlay} className={toggleCursor}>
        {isPlaying ? <PauseIcon size={18} color={toggleIconColor} /> : <PlayIcon size={18} color={toggleIconColor} />}
      </button>
      <button type='button' onClick={nextPlay} disabled={isNextButtonDisabled} className={nextCursor}>
        <NextIcon size={18} color={nextIconColor} />
      </button>
    </div>
  );
});

const ProgressBar = ({ className }: { className?: string }) => {
  const { duration, currentTime, playerRef, setCurrentTime } = usePlayer();
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getTimeFromPosition = (clientX: number) => {
    if (!progressBarRef.current || duration === 0) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    return percentage * duration;
  };

  const updateTime = (newTime: number) => {
    if (!playerRef) return;

    setCurrentTime(newTime);

    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }

    seekTimeoutRef.current = setTimeout(() => {
      playerRef.seekTo(newTime, true);
    }, 50);
  };

  const handlePointerDown = (e: PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const newTime = getTimeFromPosition(e.clientX);
    updateTime(newTime);

    // Pointer capture로 드래그 중 화면 밖으로 나가도 추적
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    e.stopPropagation();

    if (!isDragging) return;
    const newTime = getTimeFromPosition(e.clientX);
    updateTime(newTime);
  };

  const handlePointerUp = (e: PointerEvent) => {
    e.stopPropagation();

    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isDragging) return;
    const newTime = getTimeFromPosition(e.clientX);
    updateTime(newTime);
  };

  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${className || ''}`}>
      <div
        ref={progressBarRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className='h-[3px] hover:h-[6px] transition-all delay-[0.2] bg-[#e5e4e3] cursor-pointer relative overflow-hidden touch-none'
      >
        <div
          className='progress absolute inset-0 h-full origin-left will-change-transform'
          style={{
            transform: `scaleX(${progress / 100})`,
            background: 'linear-gradient(90deg, #6b5cf0 0%, #d4b8f3 70%, #b681e7 100%)',
          }}
        />

        <div
          className={`thumb absolute top-1/2 w-3 h-3 bg-[#b681e7] rounded-full shadow-lg transition-shadow will-change-transform ${
            isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
          }`}
          style={{
            left: `${progress}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 8px rgba(168, 160, 232, 0.6)',
          }}
        />
      </div>
    </div>
  );
};

const PlayerVolumeControl = memo(() => {
  const [isHovered, setIsHovered] = useAtom(isHoveredVolumeButton);
  const { handleVolume, volume, setVolume, isActuallyPlayerReady } = usePlayer();

  const handleVolumeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number(e.target.value);
      handleVolume(newVolume);
      setVolume(newVolume);
    },
    [handleVolume, setVolume],
  );

  const volumeIconColor = isActuallyPlayerReady && volume > 0 ? ACTIVE_COLOR : DISABLED_COLOR;
  const CurrentVolumeIcon = volume === 0 ? MutedVolumeIcon : VolumeIcon;

  const handleMouseEnter = () => {
    if (!isActuallyPlayerReady) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isActuallyPlayerReady) return;
    setIsHovered(false);
  };

  const handleClickVolumeWrapper = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      className='volume-wrapper flex items-center relative z-10'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClickVolumeWrapper}
    >
      <div
        className={`absolute right-full top-1/2 -translate-y-1/2 w-[80px] pr-2 ${
          isHovered ? 'z-20 opacity-100 visible' : 'z-[-1] opacity-0 invisible'
        } transition-all duration-200 pb-[5px]`}
      >
        <input
          type='range'
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
          className='cursor-pointer h-1 w-full'
          disabled={!isActuallyPlayerReady}
        />
      </div>

      <button type='button' className='cursor-pointer z-10 relative' disabled={!isActuallyPlayerReady}>
        <CurrentVolumeIcon size={18} color={volumeIconColor} />
      </button>
    </div>
  );
});

export const PlayerControl = {
  Frame: PlayerFrame,
  Buttons: PlayerButtons,
  ProgressBar,
  Volume: PlayerVolumeControl,
};
