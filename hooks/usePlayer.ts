import { MouseEvent } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import {
  currentVideoIdAtom,
  isPlayingState,
  playerRefAtom,
  isPlayerReadyAtom,
  currentTimeAtom,
  durationAtom,
  volumeAtom,
  playlistState,
  PlaylistItem,
  isPanelOpen,
  currentIndexAtom,
  currentVideoAtom,
  lastIndexAtom,
} from '@/store/playerAtom';

export const usePlayerCore = () => {
  const [playlist, setPlaylist] = useAtom(playlistState);
  const [currentVideoId, setCurrentVideoId] = useAtom(currentVideoIdAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingState);
  const [playerRef, setPlayerRef] = useAtom(playerRefAtom);
  const [isPlayerReady, setIsPlayerReady] = useAtom(isPlayerReadyAtom);
  const [isPlaylistPanelOpen, setIsPlaylistPanelOpen] = useAtom(isPanelOpen);

  const currentIndex = useAtomValue(currentIndexAtom);
  const currentVideo = useAtomValue(currentVideoAtom);
  const lastIndex = useAtomValue(lastIndexAtom);

  const isActuallyPlayerReady = playerRef !== null && isPlayerReady;

  const setPlaylistAndPlay = (items: PlaylistItem[], videoId: string) => {
    setPlaylist(items);
    setCurrentVideoId(videoId);
    setIsPlaying(true);
  };

  const addToPlaylistAndPlay = (item: PlaylistItem) => {
    setPlaylist(prev => {
      const hasExisted = prev.some(video => video.videoId === item.videoId);

      if (hasExisted) {
        setCurrentVideoId(item.videoId);
        setIsPlaying(true);
        return prev;
      }

      return [...prev, item];
    });
    setCurrentVideoId(item.videoId);
    setIsPlaying(true);
  };

  const nextPlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (currentIndex < playlist.length - 1) {
      setCurrentVideoId(playlist[currentIndex + 1].videoId);
      setIsPlaying(true);
    }
  };

  const prevPlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (currentIndex > 0) {
      setCurrentVideoId(playlist[currentIndex - 1].videoId);
      setIsPlaying(true);
    }
  };

  const togglePlay = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isActuallyPlayerReady) return;
    setIsPlaying(!isPlaying);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentVideoId(null);
    setIsPlaying(false);
  };

  const togglePlaylistPanel = () => {
    if (!currentVideo) return;
    setIsPlaylistPanelOpen(prev => !prev);
  };

  return {
    playerRef,
    setPlayerRef,
    isActuallyPlayerReady,
    isPlayerReady,
    setIsPlayerReady,
    isPlaying,
    setIsPlaying,
    currentIndex,
    currentVideoId,
    setCurrentVideoId,
    playlist,
    lastIndex,
    currentVideo,
    setPlaylistAndPlay,
    addToPlaylistAndPlay,
    nextPlay,
    prevPlay,
    togglePlay,
    clearPlaylist,
    isPlaylistPanelOpen,
    togglePlaylistPanel,
  };
};

export const usePlayerTime = () => {
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const playerRef = useAtomValue(playerRefAtom);

  const seekTo = (seconds: number) => {
    if (playerRef) {
      playerRef.seekTo(seconds, true);
    }
  };

  return {
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    playerRef,
    seekTo,
  };
};

export const usePlayerVolume = () => {
  const [volume, setVolume] = useAtom(volumeAtom);
  const playerRef = useAtomValue(playerRefAtom);

  const handleVolume = (volume: number) => {
    if (playerRef) {
      playerRef.setVolume(volume); // 0-100
    }
  };

  return {
    volume,
    setVolume,
    handleVolume,
  };
};

export const usePlayer = () => {
  const core = usePlayerCore();
  const time = usePlayerTime();
  const volumeCtrl = usePlayerVolume();

  return {
    ...core,
    ...time,
    ...volumeCtrl,
  };
};
