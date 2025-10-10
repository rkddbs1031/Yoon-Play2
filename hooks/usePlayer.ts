import { MouseEvent } from 'react';
import { useAtom } from 'jotai';

import {
  PlaylistItem,
  currentVideoIdAtom,
  currentTimeAtom,
  durationAtom,
  isPlayingState,
  playlistState,
  volumeAtom,
  playerRefAtom,
  isPlayerReadyAtom,
  isPanelOpen,
} from '@/store/playerAtom';

export const usePlayer = () => {
  const [playlist, setPlaylist] = useAtom(playlistState);
  const [currentVideoId, setCurrentVideoId] = useAtom(currentVideoIdAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingState);
  const [playerRef, setPlayerRef] = useAtom(playerRefAtom);
  const [isPlayerReady, setIsPlayerReady] = useAtom(isPlayerReadyAtom);
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [volume, setVolume] = useAtom(volumeAtom);
  const [isPlaylistPanelOpen, setIsPlaylistPanelOpen] = useAtom(isPanelOpen);

  const currentIndex = playlist.findIndex(item => item.videoId === currentVideoId);
  const currentVideo = currentIndex !== -1 ? playlist[currentIndex] : null;
  const lastIndex = playlist.length - 1;
  const isActuallyPlayerReady = playerRef !== null && isPlayerReady; // 실제 플레이어 조작 가능 상태

  const setPlaylistAndPlay = (items: PlaylistItem[], videoId: string) => {
    setPlaylist(items);
    setCurrentVideoId(videoId);
    setIsPlaying(true);
  };

  const addToPlaylistAndPlay = (item: PlaylistItem) => {
    setPlaylist(prev => [...prev, item]);
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

  const handleVolume = (volume: number) => {
    if (playerRef) {
      playerRef.setVolume(volume); // 0-100
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef) {
      playerRef.seekTo(seconds, true);
    }
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
    playlist,
    currentIndex,
    currentVideoId,
    setCurrentVideoId,
    lastIndex,
    isPlaying,
    setIsPlaying,
    currentVideo,
    setPlaylistAndPlay,
    addToPlaylistAndPlay,
    nextPlay,
    prevPlay,
    togglePlay,
    clearPlaylist,
    seekTo,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    handleVolume,
    isPlaylistPanelOpen,
    togglePlaylistPanel,
  };
};
