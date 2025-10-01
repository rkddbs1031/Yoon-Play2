import { ChangeEvent, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

import { usePlayer } from '@/hooks/usePlayer';
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from '@/states/icon/svgs';

const PlayerFrame = () => {
  const { currentVideo, isPlaying, setPlayerRef, setDuration, setCurrentTime } = usePlayer();
  const localRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleReady = (e: YouTubeEvent) => {
    localRef.current = e.target;
    setPlayerRef(e.target);

    const duration = e.target.getDuration();
    setDuration(duration);
    setCurrentTime(0);

    if (isPlaying) {
      e.target.playVideo();
    }
  };

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (localRef.current) {
        const time = localRef.current.getCurrentTime();
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
    // 1 = 재생중, 2 = 일시 정지, 0 = 종료
    if (e.data === 1) {
      startInterval();
    } else {
      stopInterval();
    }
  };

  const handleEnd = () => {
    // TODO: 다음 곡 재생
  };

  useEffect(() => {
    if (!localRef.current) return;

    if (isPlaying) {
      localRef.current.playVideo();
    } else {
      localRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => stopInterval();
  }, [stopInterval]);

  if (!currentVideo) return null;

  return (
    <YouTube
      key={currentVideo.videoId}
      className='hidden'
      videoId={currentVideo.videoId}
      onReady={handleReady}
      onStateChange={handleStateChange}
      onEnd={handleEnd}
      opts={{
        playerVars: {
          autoplay: 0,
        },
      }}
    />
  );
};

export const PlayerControl = {
  Frame: PlayerFrame,
};
