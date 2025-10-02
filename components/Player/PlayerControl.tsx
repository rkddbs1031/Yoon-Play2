import { ChangeEvent, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';

import { usePlayer } from '@/hooks/usePlayer';
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from '@/states/icon/svgs';

const PlayerFrame = () => {
  const {
    currentVideo,
    isPlaying,
    setIsPlaying,
    playerRef,
    setPlayerRef,
    setDuration,
    setCurrentTime,
    volume,
    lastIndex,
    currentIndex,
    setCurrentIndex,
  } = usePlayer();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleReady = (e: YouTubeEvent) => {
    setPlayerRef(e.target);

    const duration = e.target.getDuration();
    setDuration(duration);
    setCurrentTime(0);

    if (isPlaying) {
      e.target.playVideo();
    }
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
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
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
    // 0 = 종료, 1 = 재생중, 2 = 일시 정지, 3 = 버퍼링 5 = 동영상 준비
    if (e.data === 1) {
      startInterval();
    } else if (e.data === 0 || e.data === 2) {
      stopInterval();
    }
  };

  useEffect(() => {
    if (!playerRef?.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, playerRef]);

  useEffect(() => {
    if (playerRef?.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    return () => stopInterval();
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
        },
      }}
    />
  );
};

const PlayerButtons = () => {
  const { playlist, isPlaying, currentIndex, prevPlay, nextPlay, togglePlay } = usePlayer();

  return (
    <div className='button-wrapper flex flex-row gap-2 items-center'>
      <button type='button' onClick={prevPlay} disabled={currentIndex === 0} className='cursor-pointer'>
        <PrevIcon color={'white'} />
      </button>
      <button type='button' onClick={togglePlay} className='cursor-pointer'>
        {isPlaying ? <PauseIcon color={'white'} /> : <PlayIcon color={'white'} />}
      </button>
      <button
        type='button'
        onClick={nextPlay}
        disabled={currentIndex === playlist.length - 1}
        className='cursor-pointer'
      >
        <NextIcon color={'white'} />
      </button>
    </div>
  );
};

const ProgressBar = ({ className }: { className?: string }) => {
  const { duration, currentTime, playerRef, setCurrentTime } = usePlayer();
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!playerRef || duration === 0) return;

    const newTime = Number(e.target.value);
    setCurrentTime(newTime);

    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }

    seekTimeoutRef.current = setTimeout(() => {
      playerRef.seekTo(newTime, true);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type='range'
      min='0'
      max={duration || 0}
      value={currentTime}
      step='0.1'
      onChange={handleChange}
      className={`h-1 ${className || ''}`}
    />
  );
};

const PlayerVolumeControl = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { handleVolume, volume, setVolume } = usePlayer();

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    handleVolume(newVolume);
    setVolume(newVolume);
  };

  return (
    <div
      className='volume-wrapper flex items-center gap-3'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button type='button' className='cursor-pointer'>
        <VolumeIcon size={20} color={'white'} />
      </button>
      {isHovered && (
        <input
          type='range'
          min={0}
          max={100}
          value={volume}
          onChange={handleVolumeChange}
          className='cursor-pointer h-1'
        />
      )}
    </div>
  );
};

export const PlayerControl = {
  Frame: PlayerFrame,
  Buttons: PlayerButtons,
  ProgressBar,
  Volume: PlayerVolumeControl,
};
