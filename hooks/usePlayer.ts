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
  isPanelOpen,
  currentIndexAtom,
  currentVideoAtom,
  lastIndexAtom,
  playlistSourceAtom,
} from '@/store/playerAtom';
import { PlaylistItem, PlaylistSource } from '@/types/playlist';

export const usePlayerCore = () => {
  const [playlist, setPlaylist] = useAtom(playlistState);
  const [playlistSource, setPlaylistSource] = useAtom(playlistSourceAtom);
  const [currentVideoId, setCurrentVideoId] = useAtom(currentVideoIdAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingState);
  const [playerRef, setPlayerRef] = useAtom(playerRefAtom);
  const [isPlayerReady, setIsPlayerReady] = useAtom(isPlayerReadyAtom);
  const [isPlaylistPanelOpen, setIsPlaylistPanelOpen] = useAtom(isPanelOpen);

  const currentIndex = useAtomValue(currentIndexAtom);
  const currentVideo = useAtomValue(currentVideoAtom);
  const lastIndex = useAtomValue(lastIndexAtom);

  const isActuallyPlayerReady = playerRef !== null && isPlayerReady;

  const setPlayerListFromSearch = (items: PlaylistItem[], clickedItem: PlaylistItem) => {
    setPlaylist(prev => {
      // 첫 검색 -> 전체 교체
      if (playlistSource !== PlaylistSource.Search) return items;

      const hasExisted = prev.some(p => p.videoId === clickedItem.videoId);
      return hasExisted ? prev : [...prev, clickedItem];
    });

    setPlaylistSource(PlaylistSource.Search);
    setCurrentVideoId(clickedItem.videoId);
    setIsPlaying(true);
  };

  const setPlayerListFromContext = (items: PlaylistItem[], clickedItem: PlaylistItem) => {
    setPlaylist(items);
    setPlaylistSource(PlaylistSource.Context);
    setCurrentVideoId(clickedItem.videoId);
    setIsPlaying(true);
  };

  const removePlaylist = (item: PlaylistItem) => {
    setPlaylist(prev => {
      const removeIndex = prev.findIndex(v => v.videoId === item.videoId);

      if (removeIndex === -1) return prev;

      const nextPlaylist = prev.filter(v => v.videoId !== item.videoId);

      // 현재 재생 중인 곡을 삭제한 경우
      if (item.videoId === currentVideoId) {
        if (nextPlaylist.length === 0) {
          setCurrentVideoId(null);
          setIsPlaying(false);
          return nextPlaylist;
        }

        // 다음 곡 우선, 없으면 이전 곡.
        const nextIndex = removeIndex < nextPlaylist.length ? removeIndex : removeIndex - 1;

        setCurrentVideoId(nextPlaylist[nextIndex].videoId);
        setIsPlaying(true);
      }

      return nextPlaylist;
    });
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
    setPlayerListFromSearch,
    setPlayerListFromContext,
    removePlaylist,
    nextPlay,
    prevPlay,
    togglePlay,
    clearPlaylist,
    isPlaylistPanelOpen,
    togglePlaylistPanel,
    playlistSource,
    setPlaylistSource,
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
