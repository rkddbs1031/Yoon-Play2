import { useRecoilState } from 'recoil';
import { currentPlayingIndexState, isPlayingState, playlistState } from '@/store/playerAtom';

export const usePlayer = () => {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentIndex, setCurrentIndex] = useRecoilState(currentPlayingIndexState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const currentVideo = playlist[currentIndex] || null;

  const nextPlay = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPlay = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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

  return {
    playlist,
    currentIndex,
    isPlaying,
    currentVideo,
    nextPlay,
    prevPlay,
    togglePlay,
    clearPlaylist,
  };
};
