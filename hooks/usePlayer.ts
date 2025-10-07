import { useAtom } from 'jotai';

import {
  PlaylistItem,
  currentPlayingIndexState,
  currentTimeAtom,
  durationAtom,
  isPlayingState,
  playlistState,
  volumeAtom,
  playerRefAtom,
  isPlayerReadyAtom,
} from '@/store/playerAtom';

export const usePlayer = () => {
  const [playlist, setPlaylist] = useAtom(playlistState);
  const [currentIndex, setCurrentIndex] = useAtom(currentPlayingIndexState);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingState);
  const [playerRef, setPlayerRef] = useAtom(playerRefAtom);
  const [isPlayerReady, setIsPlayerReady] = useAtom(isPlayerReadyAtom);
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  const [volume, setVolume] = useAtom(volumeAtom);

  const currentVideo = playlist[currentIndex] || null;
  const lastIndex = playlist.length - 1;
  const isActuallyPlayerReady = playerRef !== null && isPlayerReady; // 실제 플레이어 조작 가능 상태

  const setPlaylistAndPlay = (items: PlaylistItem[], startIndex: number) => {
    setPlaylist(items);
    setCurrentIndex(startIndex);
    setIsPlaying(true);
  };

  const nextPlay = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const prevPlay = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!isActuallyPlayerReady) return;
    setIsPlaying(!isPlaying);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentIndex(0);
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

  return {
    playerRef,
    setPlayerRef,
    isActuallyPlayerReady,
    isPlayerReady,
    setIsPlayerReady,
    playlist,
    currentIndex,
    setCurrentIndex,
    lastIndex,
    isPlaying,
    setIsPlaying,
    currentVideo,
    setPlaylistAndPlay,
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
  };
};
