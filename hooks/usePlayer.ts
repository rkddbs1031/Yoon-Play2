import { atom, useAtom } from 'jotai';
import { PlaylistItem, currentPlayingIndexState, isPlayingState, playlistState } from '@/store/playerAtom';
import { YouTubePlayer } from 'react-youtube';

export const playerRefAtom = atom<YouTubePlayer | null>(null);

export const usePlayer = () => {
  const [playlist, setPlaylist] = useAtom(playlistState);
  const [currentIndex, setCurrentIndex] = useAtom(currentPlayingIndexState);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingState);
  const [playerRef, setPlayerRef] = useAtom(playerRefAtom);

  const currentVideo = playlist[currentIndex] || null;

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
    setIsPlaying(!isPlaying);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const setVolume = (volume: number) => {
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
    playlist,
    currentIndex,
    isPlaying,
    currentVideo,
    setPlaylistAndPlay,
    nextPlay,
    prevPlay,
    togglePlay,
    clearPlaylist,
    setPlayerRef,
    setVolume,
    seekTo,
  };
};
