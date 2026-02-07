'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import * as playlistDB from '@/lib/indexedDB/playlistDB';
import { PlaylistDB, PlaylistItem } from '@/types/playlist';
import { playlistTargetTrackAtom } from '@/store/playlist/atoms';

export const usePlaylist = () => {
  const [playlists, setPlaylists] = useState<PlaylistDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetTrack, setTargetTrack] = useAtom(playlistTargetTrackAtom);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const data = await playlistDB.getPlaylists();
      setPlaylists(data);
    } catch (e) {
      console.error('Failed to fetch playlists', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async ({
    title,
    description,
    initialTrack,
  }: {
    title: string;
    description?: string;
    initialTrack?: PlaylistItem;
  }) => {
    await playlistDB.createPlaylist({
      title,
      description,
      initialTrack,
    });

    await fetchPlaylists(); // 생성 후 목록 재조회
    setTargetTrack(null);
  };

  return {
    playlists,
    isLoading,
    refetch: fetchPlaylists,

    targetTrack,
    setPlaylistTargetTrack: (track: PlaylistItem) => setTargetTrack(track),
    clearPlaylistTargetTrack: () => setTargetTrack(null),

    onCreatePlaylist: handleCreatePlaylist,
  };
};
