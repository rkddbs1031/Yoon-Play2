import { ChangeEvent, useEffect, useRef, useState, PointerEvent, MouseEvent, useCallback, memo } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useAtom, useAtomValue } from 'jotai';

import { ACTIVE_COLOR, DISABLED_COLOR } from '@/constants/colors';
import { usePlayer, usePlayerCore, usePlayerTime, usePlayerVolume } from '@/hooks/usePlayer';
import { MutedVolumeIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from '@/states/icon/svgs';
import { isHoveredVolumeButton, isPlayerReadyAtom } from '@/store/player/atom';

const PlayerFrame = () => {
  const {
    currentIndex,
    currentVideo,
    setCurrentVideoId,
    lastIndex,
    isPlaying,
    setIsPlaying,
    playerRef,
    setPlayerRef,
    setDuration,
    setCurrentTime,
    volume,
    isActuallyPlayerReady,
    setIsPlayerReady,
    playlist,
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
      setCurrentVideoId(playlist[currentIndex + 1].videoId);
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
        const newTime = localPlayerRef.current.getCurrentTime();

        setCurrentTime(prev => {
          const diff = Math.abs(newTime - prev);
          return diff > 0.3 ? newTime : prev;
        });
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

interface IconButtonSize {
  size?: number;
}

interface ColorProps {
  color?: string;
  disabledColor?: string | null;
}

const PlayerButtons = memo(({ size = 18, color, disabledColor }: IconButtonSize & ColorProps) => {
  const isHovered = useAtomValue(isHoveredVolumeButton);
  const { isPlaying, currentIndex, lastIndex, isActuallyPlayerReady, prevPlay, nextPlay, togglePlay } = usePlayerCore();

  const isPrevButtonDisabled = !isActuallyPlayerReady || currentIndex === 0;
  const prevIconColor = isPrevButtonDisabled ? disabledColor || DISABLED_COLOR : color || ACTIVE_COLOR;
  const prevCursor = isPrevButtonDisabled ? 'cursor-default' : 'cursor-pointer';

  const isToggleButtonDisabled = !isActuallyPlayerReady;
  const toggleIconColor = isToggleButtonDisabled ? disabledColor || DISABLED_COLOR : color || ACTIVE_COLOR;
  const toggleCursor = isToggleButtonDisabled ? 'cursor-default' : 'cursor-pointer';

  const isNextButtonDisabled = !isActuallyPlayerReady || currentIndex === lastIndex;
  const nextIconColor = isNextButtonDisabled ? disabledColor || DISABLED_COLOR : color || ACTIVE_COLOR;
  const nextCursor = isNextButtonDisabled ? 'cursor-default' : 'cursor-pointer';

  return (
    <div
      className={`${isHovered ? 'opacity-0' : 'opacity-100'} transition-all button-wrapper flex flex-row gap-1 items-center justify-center`}
    >
      <button type='button' onClick={prevPlay} disabled={isPrevButtonDisabled} className={`${prevCursor} p-[2px]`}>
        <PrevIcon size={size} color={prevIconColor} />
      </button>
      <button type='button' onClick={togglePlay} className={`${toggleCursor} p-[2px]`}>
        {isPlaying ? (
          <PauseIcon size={size} color={toggleIconColor} />
        ) : (
          <PlayIcon size={size} color={toggleIconColor} />
        )}
      </button>
      <button type='button' onClick={nextPlay} disabled={isNextButtonDisabled} className={`${nextCursor} p-[2px]`}>
        <NextIcon size={size} color={nextIconColor} />
      </button>
    </div>
  );
});

const ProgressBar = memo(({ className }: { className?: string }) => {
  const { duration, currentTime, playerRef, setCurrentTime } = usePlayerTime();
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
    <div className={`progress-bar relative w-full ${className || ''}`}>
      <div
        ref={progressBarRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className='h-[3px] hover:h-[6px] transition-all delay-[0.2] bg-[rgba(255,255,255,0.6)] cursor-pointer relative overflow-hidden touch-none'
      >
        <div
          className='progress absolute inset-0 h-full origin-left will-change-transform'
          style={{
            transform: `scaleX(${progress / 100})`,
            background: `linear-gradient(90deg, #5E9F94 0%, #78B7AC 65%, #A9D8CF 100%)`,
          }}
        />

        <div
          className={`thumb absolute top-1/2 w-[2px] h-3 rounded-full shadow-lg transition-shadow will-change-transform ${
            isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
          }`}
          style={{
            left: `${progress}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#5E9F94',
            boxShadow: '0 0 8px rgba(94,159,148,0.45)',
          }}
        />
      </div>
    </div>
  );
});

const PlayerVolumeControl = memo(({ color, disabledColor }: ColorProps) => {
  const [isHovered, setIsHovered] = useAtom(isHoveredVolumeButton);
  const { handleVolume, volume, setVolume } = usePlayerVolume();
  const isActuallyPlayerReady = useAtomValue(isPlayerReadyAtom);

  const handleVolumeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newVolume = Number(e.target.value);
      handleVolume(newVolume);
      setVolume(newVolume);
    },
    [handleVolume, setVolume],
  );

  const volumeIconColor = isActuallyPlayerReady ? color || ACTIVE_COLOR : disabledColor || DISABLED_COLOR;
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

      <button type='button' className='cursor-pointer z-10 relative p-[2px]' disabled={!isActuallyPlayerReady}>
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
